import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseAdminClient } from '@/lib/supabase';
import { sendTemplatedEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';
import { 
  AUTH_ERRORS, 
  createErrorResponse, 
  createSuccessResponse, 
  logError, 
  handleDatabaseError,
  handleValidationError 
} from '@/lib/errors';

export async function POST(req: NextRequest) {
  const supabaseAdmin = createServerSupabaseAdminClient();
  
  try {
    const { name, email, password } = await req.json();
    
    // Validation with detailed error messages
    if (!name || !email || !password) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      
      return NextResponse.json(
        createErrorResponse(
          'MISSING_FIELDS',
          AUTH_ERRORS.SIGNUP.MISSING_FIELDS,
          'VALIDATION_FAILED',
          { missingFields }
        ),
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        createErrorResponse(
          'INVALID_EMAIL',
          AUTH_ERRORS.SIGNUP.INVALID_EMAIL,
          'VALIDATION_FAILED',
          { email }
        ),
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        createErrorResponse(
          'PASSWORD_TOO_SHORT',
          AUTH_ERRORS.SIGNUP.PASSWORD_TOO_SHORT,
          'VALIDATION_FAILED',
          { length: password.length, required: 8 }
        ),
        { status: 400 }
      );
    }
    
    // Check for password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        createErrorResponse(
          'PASSWORD_TOO_WEAK',
          AUTH_ERRORS.SIGNUP.PASSWORD_TOO_WEAK,
          'VALIDATION_FAILED',
          { 
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
          }
        ),
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: userCheck, error: checkError } = await supabaseAdmin
      .rpc('nextauth_user_operation', {
        operation: 'check',
        user_email: email,
        user_google_id: null,
        user_image_url: null,
        user_name: null
      });

    if (checkError) {
      logError('SIGNUP_USER_CHECK', checkError, { email });
      const dbError = handleDatabaseError(checkError, 'SIGNUP_USER_CHECK');
      return NextResponse.json(dbError, { status: 500 });
    }

    if (userCheck && userCheck.exists) {
      return NextResponse.json(
        createErrorResponse(
          'USER_ALREADY_EXISTS',
          AUTH_ERRORS.SIGNUP.USER_ALREADY_EXISTS,
          'DUPLICATE_ENTRY',
          { email }
        ),
        { status: 409 }
      );
    }

    // Hash the password
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (hashError) {
      logError('SIGNUP_PASSWORD_HASH', hashError, { email });
      return NextResponse.json(
        createErrorResponse(
          'PASSWORD_HASH_ERROR',
          AUTH_ERRORS.SIGNUP.PASSWORD_HASH_ERROR,
          'HASH_ERROR',
          { email }
        ),
        { status: 500 }
      );
    }

    // Create user using the database function with password
    const { data: createResult, error: insertError } = await supabaseAdmin
      .rpc('nextauth_user_operation', {
        operation: 'create',
        user_email: email,
        user_google_id: null,
        user_image_url: null,
        user_name: name,
        user_password: hashedPassword
      });

    if (insertError || !createResult) {
      logError('SIGNUP_USER_CREATION', insertError, { email, name });
      const dbError = handleDatabaseError(insertError || 'No result returned', 'SIGNUP_USER_CREATION');
      return NextResponse.json(dbError, { status: 500 });
    }

    console.log(`✅ User successfully created: ${email} with ID: ${createResult.id}`);

    // Send welcome email (don't fail signup if email fails)
    try {
      const loginUrl = new URL('/auth/signin', req.nextUrl.origin).toString();
      
      await sendTemplatedEmail({
        to: email,
        template: 'welcome',
        data: {
          name: name,
          loginUrl: loginUrl
        },
        companyLogoUrl: process.env.NEXT_PUBLIC_COMPANY_LOGO_URL
      });
    } catch (emailError) {
      logError('SIGNUP_WELCOME_EMAIL', emailError, { email, userId: createResult.id });
      // Don't fail signup if email fails, just log it
      console.warn('⚠️ Welcome email failed to send, but user was created successfully');
    }

    return NextResponse.json(
      createSuccessResponse(
        { 
          id: createResult.id, 
          name: createResult.name, 
          email: createResult.email 
        },
        'Account created successfully'
      )
    );

  } catch (e) {
    logError('SIGNUP_UNKNOWN_ERROR', e, { 
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries())
    });
    
    return NextResponse.json(
      createErrorResponse(
        'UNKNOWN_ERROR',
        AUTH_ERRORS.SIGNUP.UNKNOWN_ERROR,
        'INTERNAL_ERROR',
        { 
          url: req.url,
          method: req.method 
        }
      ),
      { status: 500 }
    );
  }
}
