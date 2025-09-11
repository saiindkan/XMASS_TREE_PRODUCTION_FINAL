-- Fix OTP verification system
-- This will create the missing functions and ensure proper table structure

-- 1. First, let's check what we have
SELECT 'Checking current setup...' as status;

-- 2. Create the missing create_password_reset_request function
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

-- 3. Create the missing check_otp_validity function
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

-- 4. Grant execute permissions
GRANT EXECUTE ON FUNCTION create_password_reset_request(TEXT, TEXT, TIMESTAMP WITH TIME ZONE) TO authenticated;
GRANT EXECUTE ON FUNCTION check_otp_validity(TEXT, TEXT) TO authenticated;

-- 5. Verify functions were created
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name IN ('create_password_reset_request', 'check_otp_validity');

-- 6. Success message
SELECT '✅ OTP verification functions created successfully!' as status;
