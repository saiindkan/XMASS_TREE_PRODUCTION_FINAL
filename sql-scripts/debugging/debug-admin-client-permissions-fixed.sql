-- Debug admin client permissions issue - Fixed for compatibility
-- This will help us understand why the service role is still getting blocked

-- 1. Check if RLS is actually disabled or if policies are working
SELECT '=== RLS STATUS CHECK ===' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN 'RLS ENABLED'
        ELSE 'RLS DISABLED'
    END as rls_status
FROM pg_tables 
WHERE tablename = 'password_resets';

-- 2. Check current policies
SELECT '=== CURRENT POLICIES ===' as info;
SELECT 
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'password_resets'
ORDER BY policyname;

-- 3. Check if the service role key is working
SELECT '=== SERVICE ROLE TEST ===' as info;

-- Test with current user context
SELECT 
    current_user,
    current_setting('role'),
    session_user;

-- 4. Try to manually test the exact operation your API is doing
SELECT '=== TESTING EXACT API OPERATION ===' as info;

-- First, let's see what records exist
SELECT 'Current password_resets records:' as info;
SELECT 
    email,
    token,
    reset_token,
    created_at,
    updated_at
FROM password_resets
ORDER BY created_at DESC
LIMIT 5;

-- 5. Test the exact UPDATE operation that's failing
SELECT '=== TESTING UPDATE OPERATION ===' as info;

DO $$
DECLARE
    test_email TEXT := 'test@example.com';
    test_otp TEXT := 'test123';
    test_reset_token TEXT := 'reset-token-123';
BEGIN
    -- First, create a test record if none exists
    IF NOT EXISTS (SELECT 1 FROM password_resets WHERE email = test_email) THEN
        INSERT INTO password_resets (
            email, 
            token, 
            expires_at, 
            created_at, 
            updated_at
        ) VALUES (
            test_email, 
            test_otp, 
            NOW() + INTERVAL '1 hour', 
            NOW(), 
            NOW()
        );
        RAISE NOTICE 'Test record created';
    END IF;
    
    -- Now try the exact UPDATE operation that's failing in your API
    UPDATE password_resets 
    SET 
        reset_token = test_reset_token,
        expires_at = NOW() + INTERVAL '1 hour',
        updated_at = NOW()
    WHERE email = test_email 
    AND token = test_otp;
    
    IF FOUND THEN
        RAISE NOTICE 'UPDATE operation SUCCESSFUL!';
        
        -- Show the updated record
        RAISE NOTICE 'Updated record: %', (
            SELECT row_to_json(p) FROM password_resets p WHERE email = test_email
        );
    ELSE
        RAISE NOTICE 'UPDATE operation found no matching rows';
    END IF;
    
    -- Clean up test data
    DELETE FROM password_resets WHERE email = test_email;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'UPDATE operation FAILED with error: %', SQLERRM;
END $$;

-- 6. Check if there are any triggers interfering
SELECT '=== CHECKING FOR TRIGGERS ===' as info;

-- Check triggers (compatible with all PostgreSQL versions)
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'password_resets';

-- 7. Test with different user roles
SELECT '=== TESTING DIFFERENT ROLES ===' as info;

-- Test as postgres superuser (this should definitely work)
DO $$
BEGIN
    SET ROLE postgres;
    
    -- Try the update operation
    UPDATE password_resets 
    SET updated_at = NOW() 
    WHERE email = 'test@example.com';
    
    RAISE NOTICE 'UPDATE as postgres: SUCCESS';
    
    RESET ROLE;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'UPDATE as postgres: FAILED - %', SQLERRM;
    RESET ROLE;
END $$;

-- 8. Check table permissions directly
SELECT '=== TABLE PERMISSIONS ===' as info;

-- Check what permissions the current user has on the table
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'password_resets'
AND grantee IN (current_user, 'authenticated', 'service_role', 'postgres');

-- 9. Final diagnostic summary
SELECT '=== DIAGNOSTIC SUMMARY ===' as info;
SELECT 'If UPDATE as postgres works but your API fails:' as scenario1;
SELECT '  - RLS policies are blocking the service role' as cause1;
SELECT '  - Need to check service role permissions' as solution1;
SELECT '' as blank;
SELECT 'If UPDATE as postgres also fails:' as scenario2;
SELECT '  - Something else is blocking updates' as cause2;
SELECT '  - Need to check table constraints/triggers' as solution2;
