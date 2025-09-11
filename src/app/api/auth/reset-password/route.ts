import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseAdminClient } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

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

    const supabaseAdmin = createServerSupabaseAdminClient();

    // Find the reset token and verify it's not expired
    const { data: resetRecord, error: tokenError } = await supabaseAdmin
      .from('password_resets')
      .select('email, reset_token_expires_at')
      .eq('reset_token', token)
      .single();

    if (tokenError || !resetRecord) {
      return NextResponse.json({ 
        error: 'Invalid token',
        message: 'Invalid or expired reset token. Please request a new password reset.'
      }, { status: 400 });
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(resetRecord.reset_token_expires_at);
    
    if (now > expiresAt) {
      // Clean up expired token
      await supabaseAdmin
        .from('password_resets')
        .delete()
        .eq('reset_token', token);

      return NextResponse.json({ 
        error: 'Expired token',
        message: 'This reset token has expired. Please request a new password reset.'
      }, { status: 400 });
    }

    // Check if the user is an OAuth user before allowing password reset
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, password, google_id')
      .eq('email', resetRecord.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ 
        error: 'User not found',
        message: 'User account not found. Please contact support.'
      }, { status: 400 });
    }

    // Check if this is an OAuth user (has google_id but no password)
    if (user.google_id && !user.password) {
      return NextResponse.json({ 
        error: 'OAuth account detected',
        message: 'This account was created with Google. Please sign in using Google instead.'
      }, { status: 400 });
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's password
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('email', resetRecord.email);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json({ 
        error: 'Database error',
        message: 'Failed to update password. Please try again.'
      }, { status: 500 });
    }

    // Delete the used reset token
    const { error: deleteError } = await supabaseAdmin
      .from('password_resets')
      .delete()
      .eq('reset_token', token);

    if (deleteError) {
      console.error('Error deleting reset token:', deleteError);
      // Don't fail the request if we can't delete the token
      // The password has already been updated successfully
    }

    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Reset password route error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again.'
    }, { status: 500 });
  }
}
