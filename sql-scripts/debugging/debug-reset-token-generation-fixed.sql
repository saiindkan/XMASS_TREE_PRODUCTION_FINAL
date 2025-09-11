-- Debug reset token generation - FIXED VERSION
-- This will identify the specific issue with generating reset tokens

-- 1. Check current table structure and data
SELECT '=== TABLE STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY ordinal_position;

-- 2. Check what records exist
SELECT '=== EXISTING RECORDS ===' as info;
SELECT 
    id,
    email,
    token,
    reset_token,
    expires_at,
    created_at,
    updated_at
FROM password_resets
ORDER BY created_at DESC
LIMIT 5;

-- 3. Check RLS status and policies
SELECT '=== RLS STATUS ===' as info;
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

-- 4. Test the exact UPDATE operation step by step
SELECT '=== TESTING EXACT UPDATE OPERATION ===' as info;

DO $$
DECLARE
    test_email TEXT;
    test_otp TEXT;
    test_record_count INTEGER;
BEGIN
    -- Check if we have any records
    SELECT COUNT(*) INTO test_record_count FROM password_resets;
    RAISE NOTICE 'Total records in password_resets: %', test_record_count;
    
    IF test_record_count > 0 THEN
        -- Get an existing record
        SELECT email, token INTO test_email, test_otp
        FROM password_resets 
        LIMIT 1;
        
        RAISE NOTICE 'Testing with existing record - Email: %, OTP: %', test_email, test_otp;
        
        -- Test 1: Can we read the record?
        RAISE NOTICE 'Test 1: Reading record...';
        PERFORM COUNT(*) FROM password_resets WHERE email = test_email AND token = test_otp;
        RAISE NOTICE '✅ Record found and readable';
        
        -- Test 2: Try to update just updated_at first
        RAISE NOTICE 'Test 2: Updating updated_at...';
        UPDATE password_resets 
        SET updated_at = NOW()
        WHERE email = test_email AND token = test_otp;
        
        IF FOUND THEN
            RAISE NOTICE '✅ Updated updated_at successfully';
        ELSE
            RAISE NOTICE '❌ Failed to update updated_at';
        END IF;
        
        -- Test 3: Try to update reset_token
        RAISE NOTICE 'Test 3: Updating reset_token...';
        UPDATE password_resets 
        SET reset_token = 'test-reset-token-123'
        WHERE email = test_email AND token = test_otp;
        
        IF FOUND THEN
            RAISE NOTICE '✅ Updated reset_token successfully';
        ELSE
            RAISE NOTICE '❌ Failed to update reset_token';
        END IF;
        
        -- Test 4: Try the full update (like your API does)
        RAISE NOTICE 'Test 4: Full update (reset_token + expires_at + updated_at)...';
        UPDATE password_resets 
        SET 
            reset_token = 'test-reset-token-456',
            expires_at = NOW() + INTERVAL '1 hour',
            updated_at = NOW()
        WHERE email = test_email AND token = test_otp;
        
        IF FOUND THEN
            RAISE NOTICE '✅ Full update successful';
        ELSE
            RAISE NOTICE '❌ Full update failed';
        END IF;
        
        -- Show the updated record
        RAISE NOTICE 'Final record state:';
        RAISE NOTICE '%', (
            SELECT row_to_json(p) FROM password_resets p WHERE email = test_email
        );
        
    ELSE
        RAISE NOTICE 'No existing records found, creating test record...';
        
        -- Create a test record
        INSERT INTO password_resets (
            email, 
            token, 
            expires_at, 
            created_at, 
            updated_at
        ) VALUES (
            'test@example.com', 
            'test123', 
            NOW() + INTERVAL '1 hour', 
            NOW(), 
            NOW()
        );
        
        RAISE NOTICE '✅ Test record created successfully';
        
        -- Now test the UPDATE
        UPDATE password_resets 
        SET 
            reset_token = 'test-reset-token-789',
            expires_at = NOW() + INTERVAL '1 hour',
            updated_at = NOW()
        WHERE email = 'test@example.com';
        
        IF FOUND THEN
            RAISE NOTICE '✅ UPDATE on test record successful';
        ELSE
            RAISE NOTICE '❌ UPDATE on test record failed';
        END IF;
        
        -- Clean up
        DELETE FROM password_resets WHERE email = 'test@example.com';
        RAISE NOTICE '✅ Test record cleaned up';
        
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Error during testing: %', SQLERRM;
    RAISE NOTICE 'Error code: %', SQLSTATE;
    RAISE NOTICE 'Error detail: %', SQLERRM;
END $$;

-- 5. Check for any triggers that might interfere
SELECT '=== CHECKING FOR TRIGGERS ===' as info;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'password_resets'
ORDER BY trigger_name;

-- 6. Check for any constraints that might block updates
SELECT '=== CHECKING FOR CONSTRAINTS ===' as info;
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'password_resets'
ORDER BY constraint_type, constraint_name;

-- 7. Summary of findings
SELECT '=== DIAGNOSTIC SUMMARY ===' as info;
SELECT 'This script will show exactly where the reset token generation is failing.' as instruction;
SELECT 'Look for:' as focus;
SELECT '  - Which specific UPDATE operation fails' as item1;
SELECT '  - Any triggers that might interfere' as item2;
SELECT '  - Any constraints blocking updates' as item3;
SELECT '  - Whether the basic operations work' as item4;
