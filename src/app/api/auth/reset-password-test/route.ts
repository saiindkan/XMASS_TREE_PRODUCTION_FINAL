import { NextRequest, NextResponse } from 'next/server';

// Test version that doesn't require database access
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'Token and password are required'
      }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ 
        error: 'Invalid password',
        message: 'Password must be at least 8 characters long'
      }, { status: 400 });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ 
        error: 'Invalid password',
        message: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character'
      }, { status: 400 });
    }

    // For testing: Accept the test token
    if (token !== 'test-token-12345') {
      return NextResponse.json({ 
        error: 'Invalid token',
        message: 'Invalid or expired reset token. Please request a new password reset.'
      }, { status: 400 });
    }

    console.log('=== TEST MODE ===');
    console.log(`Password would be updated for test user`);
    console.log(`New password: ${password.substring(0, 3)}...`);
    console.log('=================');

    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully (test mode)'
    });

  } catch (error) {
    console.error('Test reset password error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again.'
    }, { status: 500 });
  }
}
