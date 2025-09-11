import { NextRequest, NextResponse } from 'next/server';

// Test version of forgot password that doesn't require email or full Supabase setup
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required',
        message: 'Please provide an email address'
      }, { status: 400 });
    }

    // For testing: Generate a simple test token
    const testToken = 'test-token-12345';
    
    console.log('=== TEST MODE ===');
    console.log(`Reset link for ${email}: http://localhost:3000/auth/reset-password?token=${testToken}`);
    console.log('=================');

    // Always return success for testing
    return NextResponse.json({ 
      success: true,
      message: 'Check the console for your reset link (test mode)',
      testToken: testToken // Only for testing - never do this in production!
    });

  } catch (error) {
    console.error('Test forgot password error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again.'
    }, { status: 500 });
  }
}
