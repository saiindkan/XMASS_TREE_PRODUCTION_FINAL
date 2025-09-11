'use client';

import { useState, useEffect } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

interface StrengthLevel {
  label: string;
  color: string;
  bgColor: string;
  width: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password, 
  className = '' 
}) => {
  const [strength, setStrength] = useState<StrengthLevel>({
    label: 'Very Weak',
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    width: 'w-1/5'
  });

  useEffect(() => {
    const calculateStrength = (password: string): StrengthLevel => {
      if (!password) {
        return {
          label: 'Very Weak',
          color: 'text-red-600',
          bgColor: 'bg-red-500',
          width: 'w-1/5'
        };
      }

      let score = 0;
      const feedback: string[] = [];

      // Length check
      if (password.length >= 8) score += 1;
      else feedback.push('At least 8 characters');

      // Lowercase check
      if (/[a-z]/.test(password)) score += 1;
      else feedback.push('Include lowercase letters');

      // Uppercase check
      if (/[A-Z]/.test(password)) score += 1;
      else feedback.push('Include uppercase letters');

      // Numbers check
      if (/\d/.test(password)) score += 1;
      else feedback.push('Include numbers');

      // Special characters check
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
      else feedback.push('Include special characters');

      // Additional length bonus
      if (password.length >= 12) score += 1;

      // Determine strength level
      if (score <= 1) {
        return {
          label: 'Very Weak',
          color: 'text-red-600',
          bgColor: 'bg-red-500',
          width: 'w-1/5'
        };
      } else if (score === 2) {
        return {
          label: 'Weak',
          color: 'text-orange-600',
          bgColor: 'bg-orange-500',
          width: 'w-2/5'
        };
      } else if (score === 3) {
        return {
          label: 'Fair',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-500',
          width: 'w-3/5'
        };
      } else if (score === 4) {
        return {
          label: 'Good',
          color: 'text-blue-600',
          bgColor: 'bg-blue-500',
          width: 'w-4/5'
        };
      } else {
        return {
          label: 'Strong',
          color: 'text-green-600',
          bgColor: 'bg-green-500',
          width: 'w-full'
        };
      }
    };

    setStrength(calculateStrength(password));
  }, [password]);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Strength Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.bgColor}`}
          style={{ width: strength.width.replace('w-', '').replace('/5', '0%').replace('/4', '5%') }}
        ></div>
      </div>
      
      {/* Strength Label */}
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${strength.color}`}>
          Password Strength: {strength.label}
        </span>
        
        {/* Requirements */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className={`${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
            ✓ At least 8 characters
          </div>
          <div className={`${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
            ✓ Lowercase letters
          </div>
          <div className={`${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
            ✓ Uppercase letters
          </div>
          <div className={`${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
            ✓ Numbers
          </div>
          <div className={`${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
            ✓ Special characters
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
