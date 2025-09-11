// Authentication Error Constants
export const AUTH_ERRORS = {
  // Signup Errors
  SIGNUP: {
    MISSING_FIELDS: 'Missing required fields',
    INVALID_EMAIL: 'Invalid email format',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
    PASSWORD_TOO_WEAK: 'Password must contain uppercase, lowercase, number, and special character',
    USER_ALREADY_EXISTS: 'An account with this email already exists',
    DATABASE_ERROR: 'Database error occurred',
    PASSWORD_HASH_ERROR: 'Error processing password',
    EMAIL_SEND_ERROR: 'Account created but welcome email failed to send',
    UNKNOWN_ERROR: 'An unexpected error occurred during signup'
  },
  
  // Login Errors
  LOGIN: {
    MISSING_CREDENTIALS: 'Email and password are required',
    USER_NOT_FOUND: 'No account found with this email',
    INVALID_PASSWORD: 'Invalid password',
    GOOGLE_ACCOUNT: 'This account was created with Google. Please sign in with Google',
    ACCOUNT_LOCKED: 'Account is temporarily locked',
    TOO_MANY_ATTEMPTS: 'Too many login attempts. Please try again later',
    DATABASE_ERROR: 'Error accessing user account',
    UNKNOWN_ERROR: 'An unexpected error occurred during login'
  },
  
  // OAuth Errors
  OAUTH: {
    GOOGLE_ERROR: 'Google authentication failed',
    USER_CREATION_ERROR: 'Error creating user account',
    USER_UPDATE_ERROR: 'Error updating user account',
    DATABASE_ERROR: 'Database error during OAuth',
    UNKNOWN_ERROR: 'An unexpected error occurred during OAuth'
  },
  
  // General Errors
  GENERAL: {
    UNAUTHORIZED: 'You are not authorized to perform this action',
    FORBIDDEN: 'Access denied',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation failed',
    SERVER_ERROR: 'Internal server error',
    NETWORK_ERROR: 'Network error occurred',
    TIMEOUT_ERROR: 'Request timed out'
  }
};

// Error Response Helper
export interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
  details?: any;
  timestamp?: string;
}

// Create Error Response
export function createErrorResponse(
  error: string, 
  message: string, 
  code?: string, 
  details?: any
): ErrorResponse {
  return {
    error,
    message,
    code,
    details,
    timestamp: new Date().toISOString()
  };
}

// Log Error with Context
export function logError(
  context: string, 
  error: any, 
  additionalInfo?: any
) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error,
    additionalInfo
  };
  
  console.error('🔴 ERROR LOG:', JSON.stringify(errorLog, null, 2));
  
  // In production, you might want to send this to a logging service
  // like Sentry, LogRocket, or your own logging system
}

// Handle Database Errors
export function handleDatabaseError(error: any, context: string): ErrorResponse {
  if (error.code === '23505') { // Unique constraint violation
    return createErrorResponse(
      'DUPLICATE_ENTRY',
      'A record with this information already exists',
      error.code,
      { context, field: error.detail }
    );
  }
  
  if (error.code === '23503') { // Foreign key violation
    return createErrorResponse(
      'REFERENCE_ERROR',
      'Cannot delete or update due to existing references',
      error.code,
      { context, detail: error.detail }
    );
  }
  
  if (error.code === '42501') { // Permission denied
    return createErrorResponse(
      'PERMISSION_DENIED',
      'You do not have permission to perform this action',
      error.code,
      { context, detail: error.detail }
    );
  }
  
  if (error.code === '22P02') { // Invalid input syntax
    return createErrorResponse(
      'INVALID_INPUT',
      'Invalid input format provided',
      error.code,
      { context, detail: error.detail }
    );
  }
  
  // Generic database error
  return createErrorResponse(
    'DATABASE_ERROR',
    'A database error occurred',
    error.code || 'UNKNOWN',
    { context, detail: error.detail }
  );
}

// Handle Validation Errors
export function handleValidationError(
  field: string, 
  value: any, 
  rule: string
): ErrorResponse {
  return createErrorResponse(
    'VALIDATION_ERROR',
    `Validation failed for field: ${field}`,
    'VALIDATION_FAILED',
    { field, value, rule }
  );
}

// Success Response Helper
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message: string;
  timestamp: string;
}

export function createSuccessResponse<T>(
  data: T, 
  message: string
): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
}
