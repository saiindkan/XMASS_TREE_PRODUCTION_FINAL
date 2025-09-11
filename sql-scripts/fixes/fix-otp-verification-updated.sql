-- Fix OTP verification system - Updated version
-- This will drop existing functions and recreate them with correct return types

-- 1. First, let's check what we have
SELECT 'Checking current setup...' as status;

-- 2. Drop existing functions first (if they exist)
DROP FUNCTION IF EXISTS create_password_reset_request(TEXT, TEXT, TIMESTAMP WITH TIME ZONE);
DROP FUNCTION IF EXISTS check_otp_validity(TEXT, TEXT);

-- 3. Create the create_password_reset_request function
CREATE OR REPLACE FUNCTION create_password_reset_request(
  user_email TEXT,
  otp_code TEXT,
  expiration_time TIMESTAMP WITH TIME ZONE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Delete any existing reset requests for this email
  DELETE FROM password_resets WHERE email = user_email;
  
  -- Insert new reset request
  INSERT INTO password_resets (
    email,
    token,
    expires_at,
    created_at,
    updated_at
  ) VALUES (
    user_email,
    otp_code,
    expiration_time,
    NOW(),
    NOW()
  );
  
  result := json_build_object(
    'success', true,
    'message', 'Password reset request created successfully'
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN result;
END;
$$;

-- 4. Create the check_otp_validity function
CREATE OR REPLACE FUNCTION check_otp_validity(
  user_email TEXT,
  otp_code TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reset_record RECORD;
  result JSON;
BEGIN
  -- Find the reset request
  SELECT * INTO reset_record
  FROM password_resets
  WHERE email = user_email 
    AND token = otp_code
    AND expires_at > NOW();
  
  IF FOUND THEN
    result := json_build_object(
      'exists', true,
      'success', true,
      'message', 'OTP is valid'
    );
  ELSE
    result := json_build_object(
      'exists', false,
      'success', true,
      'message', 'OTP not found or expired'
    );
  END IF;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    result := json_build_object(
      'exists', false,
      'success', false,
      'error', SQLERRM
    );
    RETURN result;
END;
$$;

-- 5. Grant execute permissions
GRANT EXECUTE ON FUNCTION create_password_reset_request(TEXT, TEXT, TIMESTAMP WITH TIME ZONE) TO authenticated;
GRANT EXECUTE ON FUNCTION check_otp_validity(TEXT, TEXT) TO authenticated;

-- 6. Verify functions were created
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name IN ('create_password_reset_request', 'check_otp_validity');

-- 7. Success message
SELECT '✅ OTP verification functions recreated successfully!' as status;
