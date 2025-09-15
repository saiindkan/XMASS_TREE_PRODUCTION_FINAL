'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordTest() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [testToken, setTestToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      setMessage('Test mode: Check the console for your reset link!');
      setTestToken(data.testToken);
      setEmail(''); // Clear the email field
    } catch (error) {
      setError('Network error occurred. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password (Test Mode)
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This is a test version that works without email setup.
          </p>
        </div>

        {message && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{message}</div>
            {testToken && (
              <div className="mt-2">
                <p className="text-xs text-gray-600">Test reset link:</p>
                <Link 
                  href={`/auth/reset-password?token=${testToken}`}
                  className="text-xs text-blue-600 hover:text-blue-500 break-all"
                >
                  /auth/reset-password?token={testToken}
                </Link>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate test reset link'}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <Link 
              href="/auth/signin" 
              className="block text-sm text-green-600 hover:text-green-500"
            >
              Back to sign in
            </Link>
            <Link 
              href="/auth/forgot-password" 
              className="block text-xs text-gray-500 hover:text-gray-700"
            >
              Try full version (requires email setup)
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
