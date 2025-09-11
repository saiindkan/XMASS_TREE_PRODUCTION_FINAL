'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const getErrorMessage = (errorType: string | null) => {
  switch (errorType) {
    case 'OAuthAccountNotLinked':
      return 'To confirm your identity, sign in with the same account you used originally.';
    case 'OAuthCallback':
      return 'There was an issue with the OAuth provider. Please try again.';
    case 'OAuthCreateAccount':
      return 'Unable to create account. Please try again.';
    case 'EmailCreateAccount':
      return 'Unable to create account. The email may already be in use.';
    case 'Callback':
      return 'Unable to sign in. Please try again.';
    case 'OAuthSignin':
      return 'Error in handling the OAuth sign in. Please try again.';
    case 'Default':
    default:
      return 'An error occurred during sign in. Please try again.';
  }
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/auth/signin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
