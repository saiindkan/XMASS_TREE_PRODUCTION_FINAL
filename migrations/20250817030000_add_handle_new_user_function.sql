-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user(
  user_id TEXT,
  user_email TEXT,
  user_name TEXT
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSONB;
BEGIN
  -- Generate a new UUID for the user
  new_user_id := gen_random_uuid();
  
  -- Insert into users table
  INSERT INTO public.users (
    id,
    auth_id,
    email,
    name,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    user_id,
    user_email,
    user_name,
    NOW(),
    NOW()
  );
  
  -- Insert into profiles table
  INSERT INTO public.profiles (
    id,
    user_id,
    full_name,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    new_user_id,
    user_name,
    NOW(),
    NOW()
  );
  
  -- Return success
  result := jsonb_build_object(
    'success', true,
    'user_id', new_user_id
  );
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  -- Return error
  result := jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
  
  RETURN result;
END;
$$;
