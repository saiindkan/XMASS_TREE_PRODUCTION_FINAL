'use client';

interface PasswordMatchedProps {
  password: string;
  confirmPassword: string;
  className?: string;
}

const PasswordMatched: React.FC<PasswordMatchedProps> = ({ 
  password, 
  confirmPassword, 
  className = '' 
}) => {
  if (!password || !confirmPassword) {
    return null;
  }

  const isMatched = password === confirmPassword;
  const isStrong = password.length >= 8 && 
    /[a-z]/.test(password) && 
    /[A-Z]/.test(password) && 
    /\d/.test(password) && 
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <div className={`flex items-center space-x-1 ${isMatched ? 'text-green-600' : 'text-red-600'}`}>
        <svg 
          className={`w-4 h-4 ${isMatched ? 'text-green-500' : 'text-red-500'}`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          {isMatched ? (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          )}
        </svg>
        <span className="font-medium">
          {isMatched ? 'Passwords match' : 'Passwords do not match'}
        </span>
      </div>
      
      {isMatched && isStrong && (
        <div className="flex items-center space-x-1 text-green-600">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Strong password</span>
        </div>
      )}
    </div>
  );
};

export default PasswordMatched;
