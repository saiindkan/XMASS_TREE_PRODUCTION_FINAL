'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/config/routes';

export const GoogleSignInButton = ({
  children,
  className = '',
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  const handleClick = () => {
    signIn('google', {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <Button
      onClick={handleClick}
      className={`flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 ${className}`}
      variant="outline"
      {...props}
    >
      <FcGoogle className="w-5 h-5" />
      {children || 'Continue with Google'}
    </Button>
  );
};
