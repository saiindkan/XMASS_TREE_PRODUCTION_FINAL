import React from 'react';
import { AlertCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export interface ErrorMessageProps {
  error?: string | null;
  message?: string | null;
  type?: 'error' | 'warning' | 'info' | 'success';
  onClose?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  message,
  type = 'error',
  onClose,
  className = ''
}) => {
  if (!error && !message) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <AlertCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getStyles()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          {error && (
            <h3 className="text-sm font-medium">
              {error}
            </h3>
          )}
          {message && (
            <p className="mt-1 text-sm">
              {message}
            </p>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'error' ? 'focus:ring-red-500' :
                type === 'warning' ? 'focus:ring-yellow-500' :
                type === 'info' ? 'focus:ring-blue-500' :
                'focus:ring-green-500'
              }`}
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
