import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseAdminClient } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const supabaseAdmin = createServerSupabaseAdminClient();
  
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'Email and password are required'
      }, { status: 400 });
    }

    // Find user by email
    const { data: user, error: findError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, password')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return NextResponse.json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      }, { status: 401 });
    }

    // Check if user has a password (credential-based user)
    if (!user.password) {
      return NextResponse.json({ 
        error: 'Invalid credentials',
        message: 'This account was created with Google. Please sign in with Google.'
      }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      }, { status: 401 });
    }

    // Password is valid - return user info (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      success: true,
      user: userWithoutPassword,
      message: 'Sign in successful'
    });

  } catch (e) {
    console.error('Signin route error:', e);
    return NextResponse.json({ 
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again.'
    }, { status: 500 });
  }
}
