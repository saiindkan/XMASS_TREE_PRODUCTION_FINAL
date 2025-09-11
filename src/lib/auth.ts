

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { createServerSupabaseAdminClient } from '@/lib/supabase';
import { type AuthOptions } from "next-auth";
import { sendEmail, sendTemplatedEmail } from './email';
import bcrypt from 'bcryptjs';
import { AUTH_ERRORS, logError, handleDatabaseError } from './errors';

// Get the base URL from environment variables
const baseUrl = process.env.NEXTAUTH_URL 

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[NextAuth] Authorize called with:", { 
          email: credentials?.email, 
          passwordProvided: !!credentials?.password 
        });

        if (!credentials?.email || !credentials?.password) {
          console.log("[NextAuth] Missing credentials");
          throw new Error(AUTH_ERRORS.LOGIN.MISSING_CREDENTIALS);
        }

        const email = credentials.email;
        const password = credentials.password;

        try {
          console.log("[NextAuth] Looking up user:", email);
          
          const supabaseAdmin = createServerSupabaseAdminClient();
          
          // Use the simple, working function to get user details
          const { data: userDetails, error: detailsError } = await supabaseAdmin
            .rpc('get_user_for_login', {
              user_email: email
            });

          if (detailsError) {
            logError('NEXTAUTH_LOGIN_DB_ERROR', detailsError, { email });
            throw new Error(AUTH_ERRORS.LOGIN.DATABASE_ERROR);
          }

          if (!userDetails || userDetails.length === 0) {
            console.log("[NextAuth] User not found:", email);
            throw new Error(AUTH_ERRORS.LOGIN.USER_NOT_FOUND);
          }

          // Get the first (and only) user from the result
          const user = userDetails[0];

          // Check if user has a password (credential-based user)
          if (!user.password) {
            throw new Error(AUTH_ERRORS.LOGIN.GOOGLE_ACCOUNT);
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          
          if (!isPasswordValid) {
            console.log("[NextAuth] Invalid password for:", email);
            throw new Error(AUTH_ERRORS.LOGIN.INVALID_PASSWORD);
          }

          console.log("[NextAuth] Authentication successful for:", email);
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: null,
          };
        } catch (error) {
          if (error instanceof Error) {
            console.error("[NextAuth] Authorization error:", error.message);
            throw error; // Re-throw NextAuth errors as-is
          } else {
            logError('NEXTAUTH_LOGIN_UNKNOWN_ERROR', error, { email });
            throw new Error(AUTH_ERRORS.LOGIN.UNKNOWN_ERROR);
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours session duration
    updateAge: 60 * 60, // Update session every hour
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signIn({ user }) {
      if (user.email) {
        try {
          const loginTime = new Date().toLocaleString();
          
          await sendTemplatedEmail({
            to: user.email,
            template: 'loginNotification',
            data: {
              name: user.name || 'Valued Customer',
              loginTime: loginTime
            },
            companyLogoUrl: process.env.NEXT_PUBLIC_COMPANY_LOGO_URL
          });
        } catch (error) {
          console.error('Failed to send login email:', error);
        }
      }
    }
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Handle undefined or invalid URLs
      if (!url) {
        return baseUrl;
      }
      
      // Handle relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Handle absolute URLs
      try {
        const parsedUrl = new URL(url);
        // Only allow redirects to the same origin
        if (parsedUrl.origin === baseUrl) {
          return url;
        }
      } catch (error) {
        console.error('Invalid URL in redirect:', url, error);
      }
      
      // Default to base URL if anything goes wrong
      return baseUrl;
    },
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        try {
          const supabaseAdmin = createServerSupabaseAdminClient();
          
          // Use the simple function to check if user exists
          const { data: userDetails, error } = await supabaseAdmin
            .rpc('get_user_for_login', {
              user_email: user.email!
            });
            
          if (userDetails && userDetails.length > 0) {
            // Use the ID from our database
            token.id = userDetails[0].id;
          } else if (user.id) {
            // Fallback to the user ID from the auth system
            token.id = user.id;
          }
        } catch (error) {
          console.error('Error in JWT callback:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Add the user ID to the session
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("[NextAuth] SignIn callback called", { 
        user: user?.email, 
        account: account?.provider,
      });

      if (account?.provider === 'google') {
        try {
          const supabaseAdmin = createServerSupabaseAdminClient();
          
          // Use the simple function to check if user exists
          const { data: userDetails, error: checkError } = await supabaseAdmin
            .rpc('get_user_for_login', {
              user_email: user.email!
            });

          if (checkError) {
            console.error('Error checking for existing user:', checkError);
            return false;
          }

          if (!userDetails || userDetails.length === 0) {
            // Create new user for Google OAuth using direct insert
            try {
              const { data: newUser, error: createError } = await supabaseAdmin
                .from('users')
                .insert({
                  email: user.email!,
                  name: user.name || user.email?.split('@')[0],
                  google_id: user.id,
                  image_url: user.image,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select()
                .single();

              if (createError) {
                console.error('Error creating Google OAuth user:', createError);
                return false;
              }
              
              console.log('Successfully created Google OAuth user:', newUser.id);
              return true;
              
            } catch (error) {
              console.error('Exception during Google OAuth user creation:', error);
              return false;
            }
          } else {
            // User exists, update google_id if missing
            const existingUser = userDetails[0];
            if (!existingUser.google_id) {
              try {
                await supabaseAdmin
                  .from('users')
                  .update({ 
                    google_id: user.id,
                    image_url: user.image,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', existingUser.id);
              } catch (updateError) {
                console.error('Error updating user with google_id:', updateError);
              }
            }
            
            return true;
          }
        } catch (error) {
          console.error('Error in Google sign-in callback:', error);
          return false;
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
