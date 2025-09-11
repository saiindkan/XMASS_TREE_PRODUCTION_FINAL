-- Check service role configuration and permissions
-- This will help identify if the service role key is the issue

-- 1. Check current user and role
SELECT '=== CURRENT USER CONTEXT ===' as info;
SELECT 
    current_user,
    current_setting('role'),
    session_user,
    current_setting('application_name') as app_name;

-- 2. Check if we can access the password_resets table at all
SELECT '=== TABLE ACCESS TEST ===' as info;

-- Test basic table access
DO $$
BEGIN
    -- Try to count rows
    PERFORM COUNT(*) FROM password_resets;
    RAISE NOTICE 'SELECT access: SUCCESS - can read from table';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'SELECT access: FAILED - %', SQLERRM;
END $$;

-- 3. Check if the issue is with the specific UPDATE operation
SELECT '=== SPECIFIC UPDATE TEST ===' as info;

DO $$
DECLARE
    test_email TEXT;
    test_otp TEXT;
BEGIN
    -- Get an existing record to test with
    SELECT email, token INTO test_email, test_otp
    FROM password_resets 
    LIMIT 1;
    
    IF test_email IS NOT NULL THEN
        RAISE NOTICE 'Testing UPDATE with existing record: email=%, token=%', test_email, test_otp;
        
        -- Try the exact UPDATE operation
        UPDATE password_resets 
        SET updated_at = NOW()
        WHERE email = test_email;
        
        IF FOUND THEN
            RAISE NOTICE 'UPDATE with existing record: SUCCESS';
        ELSE
            RAISE NOTICE 'UPDATE with existing record: No rows affected';
        END IF;
        
    ELSE
        RAISE NOTICE 'No existing records found to test with';
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'UPDATE test failed: %', SQLERRM;
END $$;

-- 4. Check if the issue is with the WHERE clause
SELECT '=== WHERE CLAUSE TEST ===' as info;

DO $$
DECLARE
    test_email TEXT;
    test_otp TEXT;
BEGIN
    -- Get an existing record to test with
    SELECT email, token INTO test_email, test_otp
    FROM password_resets 
    LIMIT 1;
    
    IF test_email IS NOT NULL THEN
        RAISE NOTICE 'Testing WHERE clause: email=%, token=%', test_email, test_otp;
        
        -- Test if the WHERE clause finds the record
        PERFORM COUNT(*) FROM password_resets 
        WHERE email = test_email AND token = test_otp;
        
        RAISE NOTICE 'WHERE clause test: Found % matching records', 
            (SELECT COUNT(*) FROM password_resets WHERE email = test_email AND token = test_otp);
        
    ELSE
        RAISE NOTICE 'No existing records found to test WHERE clause';
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'WHERE clause test failed: %', SQLERRM;
END $$;

-- 5. Check if the issue is with specific columns
SELECT '=== COLUMN ACCESS TEST ===' as info;

-- Check if all required columns exist and are accessible
SELECT 
    column_name,
    data_type,
    is_nullable,
    CASE 
        WHEN column_name IN ('reset_token', 'expires_at', 'updated_at') THEN 'REQUIRED FOR UPDATE'
        ELSE 'OTHER'
    END as importance
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY importance DESC, column_name;

-- 6. Test a minimal UPDATE operation
SELECT '=== MINIMAL UPDATE TEST ===' as info;

DO $$
DECLARE
    test_email TEXT;
BEGIN
    -- Get an existing record
    SELECT email INTO test_email
    FROM password_resets 
    LIMIT 1;
    
    IF test_email IS NOT NULL THEN
        RAISE NOTICE 'Testing minimal UPDATE on email: %', test_email;
        
        -- Try the simplest possible UPDATE
        UPDATE password_resets 
        SET updated_at = NOW()
        WHERE email = test_email;
        
        IF FOUND THEN
            RAISE NOTICE 'Minimal UPDATE: SUCCESS';
        ELSE
            RAISE NOTICE 'Minimal UPDATE: No rows affected';
        END IF;
        
    ELSE
        RAISE NOTICE 'No existing records for minimal UPDATE test';
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Minimal UPDATE failed: %', SQLERRM;
END $$;

-- 7. Check for any table-level constraints
SELECT '=== TABLE CONSTRAINTS ===' as info;
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'password_resets';

-- 8. Summary of findings
SELECT '=== DIAGNOSTIC SUMMARY ===' as info;
SELECT 'Run this script to identify the exact cause of the permission denied error.' as instruction;
SELECT 'The results will show which operation is failing and why.' as explanation;
