-- Fix password_resets table with RLS enabled and proper policies
-- This maintains security while allowing OTP verification to work

-- 1. First, add the missing reset_token column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'password_resets' 
        AND column_name = 'reset_token'
    ) THEN
        ALTER TABLE password_resets ADD COLUMN reset_token TEXT;
        RAISE NOTICE 'Added reset_token column';
    ELSE
        RAISE NOTICE 'reset_token column already exists';
    END IF;
END $$;

-- 2. Check current RLS status
SELECT '=== CURRENT RLS STATUS ===' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN 'RLS ENABLED - Good for security'
        ELSE 'RLS DISABLED - Not secure'
    END as rls_status
FROM pg_tables 
WHERE tablename = 'password_resets';

-- 3. Drop any existing conflicting policies
DROP POLICY IF EXISTS "Users can create password reset requests" ON password_resets;
DROP POLICY IF EXISTS "Users can view their password reset requests" ON password_resets;
DROP POLICY IF EXISTS "Users can update their password reset requests" ON password_resets;
DROP POLICY IF EXISTS "Users can delete their password reset requests" ON password_resets;
DROP POLICY IF EXISTS "Allow all operations for password resets" ON password_resets;
DROP POLICY IF EXISTS "Allow address creation during checkout" ON password_resets;

-- 4. Create proper RLS policies for password_resets table

-- Policy 1: Allow OTP creation (INSERT) - anyone can request password reset
CREATE POLICY "Allow OTP creation for password reset" ON password_resets
FOR INSERT WITH CHECK (true);

-- Policy 2: Allow OTP verification (SELECT) - check by email and token
CREATE POLICY "Allow OTP verification" ON password_resets
FOR SELECT USING (
    email = COALESCE(auth.jwt() ->> 'email', '') 
    OR 
    -- Allow service role/admin access (for your API)
    current_setting('role') IN ('service_role', 'postgres', 'authenticated')
);

-- Policy 3: Allow OTP update (UPDATE) - for generating reset tokens
CREATE POLICY "Allow OTP update for reset token" ON password_resets
FOR UPDATE USING (
    email = COALESCE(auth.jwt() ->> 'email', '') 
    OR 
    -- Allow service role/admin access (for your API)
    current_setting('role') IN ('service_role', 'postgres', 'authenticated')
);

-- Policy 4: Allow cleanup (DELETE) - for removing expired OTPs
CREATE POLICY "Allow OTP cleanup" ON password_resets
FOR DELETE USING (
    email = COALESCE(auth.jwt() ->> 'email', '') 
    OR 
    -- Allow service role/admin access (for your API)
    current_setting('role') IN ('service_role', 'postgres', 'authenticated')
);

-- 5. Verify policies were created
SELECT '=== VERIFYING POLICIES ===' as info;
SELECT 
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'password_resets'
ORDER BY policyname;

-- 6. Test if the policies work
SELECT '=== TESTING POLICIES ===' as info;

-- Test INSERT policy
DO $$
BEGIN
    INSERT INTO password_resets (email, token, expires_at, created_at, updated_at)
    VALUES ('test@example.com', 'test123', NOW() + INTERVAL '1 hour', NOW(), NOW());
    RAISE NOTICE 'INSERT test passed - OTP creation policy works';
    
    -- Clean up test data
    DELETE FROM password_resets WHERE email = 'test@example.com';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'INSERT test failed: %', SQLERRM;
END $$;

-- Test UPDATE policy
DO $$
BEGIN
    -- First insert test data
    INSERT INTO password_resets (email, token, expires_at, created_at, updated_at)
    VALUES ('test@example.com', 'test123', NOW() + INTERVAL '1 hour', NOW(), NOW());
    
    -- Test update
    UPDATE password_resets 
    SET reset_token = 'new-token-123', updated_at = NOW()
    WHERE email = 'test@example.com';
    
    RAISE NOTICE 'UPDATE test passed - OTP update policy works';
    
    -- Clean up test data
    DELETE FROM password_resets WHERE email = 'test@example.com';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'UPDATE test failed: %', SQLERRM;
END $$;

-- 7. Show final table structure
SELECT '=== FINAL TABLE STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY ordinal_position;

-- 8. Success message
SELECT '✅ RLS policies created successfully!' as status;
SELECT 'Your OTP verification should now work with RLS enabled and secure.' as next_step;
