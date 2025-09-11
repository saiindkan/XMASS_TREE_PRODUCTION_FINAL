'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import PasswordStrengthMeter from '@/components/ui/PasswordStrengthMeter';
import PasswordMatched from '@/components/ui/PasswordMatched';   

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    // Check for at least one uppercase, lowercase, number, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, lowercase letter, number, and special character');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${window.location.origin}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Display the specific error message from the backend
        setError(data.message || 'Something went wrong');
        return;
      }

      // Redirect to sign-in page with success message
      router.push(`/auth/signin?registered=true&callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } catch (error) {
      setError('Network error occurred. Please check your connection and try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Christmas Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1544273677-6ad0f5d90e4e?auto=format&fit=crop&w=2000&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/70 via-green-900/60 to-red-800/70"></div>
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Christmas Snowfall Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`absolute bg-white/40 rounded-full`}
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
      
      {/* CSS Animation for Snowfall */}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Premium Christmas Header */}
        <div className="text-center">
          <div className="mb-6">
            <span className="inline-flex items-center px-6 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg">
              🎄 Christmas Collection 2025
            </span>
          </div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-red-200 via-white to-green-200 bg-clip-text text-transparent drop-shadow-lg">
            Join Our Family
          </h2>
          <p className="mt-3 text-white/90 text-lg">
            Create your account for premium Christmas trees
          </p>
          <p className="mt-2 text-center text-sm text-white/80">
            Already have an account?{' '}
            <Link 
              href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} 
              className="font-medium text-emerald-200 hover:text-emerald-100 underline decoration-emerald-300/50 hover:decoration-emerald-200 transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Premium Christmas Form */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl">
          {error && (
            <div className="rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-400/30 p-4 mb-6">
              <p className="text-sm text-red-100 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/40 rounded-xl placeholder-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 shadow-lg"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/40 rounded-xl placeholder-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 shadow-lg"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/40 rounded-xl placeholder-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 shadow-lg"
                  placeholder="Create a password"
                />
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2 px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl">
                  <PasswordStrengthMeter password={formData.password} />
                </div>
              )}
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/40 rounded-xl placeholder-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 shadow-lg"
                  placeholder="Confirm your password"
                />
              </div>
              
              {/* Password Matched Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl">
                  <PasswordMatched 
                    password={formData.password} 
                    confirmPassword={formData.confirmPassword} 
                  />
                </div>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-white/30 rounded bg-white/20 mt-1"
              />
              <label htmlFor="terms" className="block text-sm text-white leading-relaxed">
                I agree to the{' '}
                <a href="/terms" className="text-emerald-200 hover:text-emerald-100 underline decoration-emerald-300/50 hover:decoration-emerald-200 transition-colors duration-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-emerald-200 hover:text-emerald-100 underline decoration-emerald-300/50 hover:decoration-emerald-200 transition-colors duration-300">
                  Privacy Policy
                </a>
              </label>
            </div>

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
                    Creating Account...
                  </>
                ) : (
                  <>
                    🌲 Create Account
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
        


      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
