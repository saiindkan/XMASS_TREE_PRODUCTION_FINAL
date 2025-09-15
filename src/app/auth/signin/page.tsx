"use client";
import { signIn } from 'next-auth/react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the callback URL, ensuring it's a relative path and not the auth callback
  let callbackUrl = searchParams.get('callbackUrl') || '/';
  
  // If the callback URL is an auth callback, default to the home page
  if (callbackUrl.includes('/api/auth/') || callbackUrl.includes('/auth/')) {
    callbackUrl = '/';
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const urlError = searchParams.get('error');
    const resetSuccess = searchParams.get('reset');
    const registered = searchParams.get('registered');
    
    if (urlError) {
      setError('Invalid credentials. Please try again.');
    } else if (resetSuccess === 'success') {
      setSuccessMessage('Password reset successful! You can now sign in with your new password.');
    } else if (registered === 'true') {
      setSuccessMessage('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: callbackUrl || '/',
      });

      if (result?.error) {
        // Handle specific error messages from NextAuth
        if (result.error === 'This account was created with Google. Please sign in with Google') {
          setError('This account was created with Google. Please use the "Continue with Google" button below.');
        } else if (result.error === 'This account was created with Google. Please sign in with Google.') {
          setError('This account was created with Google. Please use the "Continue with Google" button below.');
        } else if (result.error.includes('Google')) {
          setError('This account was created with Google. Please use the "Continue with Google" button below.');
        } else {
          setError('Invalid credentials. Please try again.');
        }
      } else if (result?.ok) {
        setSuccessMessage('Signed in successfully! Redirecting...');
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Christmas Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=2000&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/70 via-green-900/60 to-red-800/70"></div>
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Christmas Snowfall Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/60 rounded-full"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
              animation: `snowfall ${8 + Math.random() * 4}s linear infinite`,
            }}
          />
        ))}
      </div>
      
      {/* Inline styles for snowfall animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes snowfall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `
      }} />

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Premium Christmas Header */}
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-6 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg">
                🎄 Christmas Collection 2025
              </span>
            </div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-red-200 via-white to-green-200 bg-clip-text text-transparent drop-shadow-lg">
              Welcome Back
            </h2>
            <p className="mt-3 text-white/90 text-lg">
              Sign in to continue your Christmas shopping
            </p>
            <p className="mt-2 text-center text-sm text-white/80">
              Or{' '}
              <Link href="/auth/signup" className="font-medium text-emerald-200 hover:text-emerald-100 underline decoration-emerald-300/50 hover:decoration-emerald-200 transition-colors duration-300">
                create a new account
              </Link>
            </p>
          </div>
          {/* Premium Christmas Form */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" value="true" />
              <div className="space-y-4">
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-white mb-2">
                    Email address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/40 rounded-xl placeholder-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 shadow-lg"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/40 rounded-xl placeholder-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 shadow-lg"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-white/30 rounded bg-white/20"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-emerald-200 hover:text-emerald-100 underline decoration-emerald-300/50 hover:decoration-emerald-200 transition-colors duration-300">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-400/30 p-4">
                  <p className="text-sm text-red-100 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}
              {successMessage && (
                <div className="rounded-xl bg-green-500/20 backdrop-blur-sm border border-green-400/30 p-4">
                  <p className="text-sm text-green-100 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {successMessage}
                  </p>
                </div>
              )}

              <div className="space-y-4 mt-8">
                              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-4 px-6 border border-emerald-800/40 text-lg font-semibold rounded-xl text-white bg-emerald-900/90 backdrop-blur-md hover:bg-emerald-800/90 focus:outline-none focus:ring-2 focus:ring-emerald-600/50 transform transition-all duration-300 hover:-translate-y-0.5 shadow-xl ${
                  loading ? 'opacity-75 cursor-not-allowed translate-y-0' : ''
                }`}
                >
                  <span className="flex items-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing In...
                      </>
                    ) : (
                      <>
                        🎄 Sign In
                      </>
                    )}
                  </span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/10 backdrop-blur-sm text-white/80 rounded-full">Or continue with</span>
                  </div>
                </div>

                <Button
                  onClick={() => signIn('google', { callbackUrl: callbackUrl })}
                  variant="outline"
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-emerald-50/95 backdrop-blur-md text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-200/60 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                >
                  <FcGoogle className="w-6 h-6" />
                  Continue with Google
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
