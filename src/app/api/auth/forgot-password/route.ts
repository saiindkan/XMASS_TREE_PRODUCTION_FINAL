import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseAdminClient } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required',
        message: 'Please provide an email address'
      }, { status: 400 });
    }

    const supabaseAdmin = createServerSupabaseAdminClient();

    // Check if user exists and get their auth method (but don't reveal this information to prevent email enumeration)
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, password, google_id')
      .eq('email', email.toLowerCase())
      .single();

    // Check if user exists and is not an OAuth user
    if (user && !userError) {
      // Check if this is an OAuth user (has google_id but no password)
      if (user.google_id && !user.password) {
        return NextResponse.json({ 
          error: 'OAuth account detected',
          message: 'This account was created with Google. Please sign in using Google instead of resetting your password.'
        }, { status: 400 });
      }

      // Check if user doesn't have a password (shouldn't happen with current schema, but just in case)
      if (!user.password) {
        return NextResponse.json({ 
          error: 'No password account',
          message: 'This account doesn\'t have a password. Please sign in using your original sign-in method.'
        }, { status: 400 });
      }
      // Generate a secure random token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

      // Store the reset token in the database
      // Use upsert to handle case where user already has a pending reset
      const { error: insertError } = await supabaseAdmin
        .from('password_resets')
        .upsert({
          email: email.toLowerCase(),
          reset_token: resetToken,
          expires_at: expiresAt.toISOString(), // For backward compatibility
          reset_token_expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        });

      if (insertError) {
        console.error('Error storing reset token:', insertError);
        return NextResponse.json({ 
          error: 'Database error',
          message: 'Failed to process reset request. Please try again.'
        }, { status: 500 });
      }

      // Send the reset email
      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
      
      try {
        await sendEmail({
          to: email,
          subject: 'Reset Your Password',
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #16a34a;">Reset Your Password</h2>
              <p>Hello${user.name ? ` ${user.name}` : ''},</p>
              <p>We received a request to reset your password. Click the button below to set a new password:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
              
              <p><strong>This link will expire in 15 minutes.</strong></p>
              
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px;">
                This email was sent from your Christmas Tree Store account.
              </p>
            </div>
          `,
          text: `
Reset Your Password

Hello${user.name ? ` ${user.name}` : ''},

We received a request to reset your password. Visit this link to set a new password:

${resetUrl}

This link will expire in 15 minutes.

If you didn't request this password reset, you can safely ignore this email.
          `
        });
      } catch (emailError) {
        console.error('Error sending reset email:', emailError);
        // Don't reveal email sending failure to prevent information disclosure
        // The user will see the generic success message
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ 
      success: true,
      message: 'If an account with that email exists, we\'ve sent you a password reset link.'
    });

  } catch (error) {
    console.error('Forgot password route error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again.'
    }, { status: 500 });
  }
}
