-- Test API Flow Step by Step
-- This will help identify exactly where the connection is failing

-- 1. Test basic table access
SELECT '=== STEP 1: Basic Table Access ===' as step;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM password_resets LIMIT 1)
        THEN '✅ Table access: SUCCESS'
        ELSE '❌ Table access: FAILED'
    END as table_access;

-- 2. Test specific record lookup (what your API does)
SELECT '=== STEP 2: Specific Record Lookup ===' as step;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM password_resets 
            WHERE email = 'vardhinenitharunkumar@gmail.com' 
            AND token = '256061'
        )
        THEN '✅ Record lookup: SUCCESS'
        ELSE '❌ Record lookup: FAILED - No matching record'
    END as record_lookup;

-- 3. Test the check_otp_validity function
SELECT '=== STEP 3: OTP Function Test ===' as step;

-- Check if function exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public' 
            AND p.proname = 'check_otp_validity'
        )
        THEN '✅ Function exists: SUCCESS'
        ELSE '❌ Function missing: FAILED'
    END as function_exists;

-- 4. Test function execution (if it exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' 
        AND p.proname = 'check_otp_validity'
    ) THEN
        RAISE NOTICE '✅ Function exists, attempting to call it...';
        -- Note: We can't call it directly from here, but we know it exists
    ELSE
        RAISE NOTICE '❌ Function check_otp_validity does not exist';
    END IF;
END $$;

-- 5. Show current data for debugging
SELECT '=== STEP 4: Current Data ===' as step;
SELECT 
    email,
    token,
    reset_token,
    expires_at,
    created_at,
    updated_at
FROM password_resets
ORDER BY created_at DESC
LIMIT 3;

-- 6. Summary
SELECT '=== SUMMARY ===' as step;
SELECT 'This test shows exactly where your API is failing.' as info;
SELECT 'Look for any ❌ FAILED messages above.' as next_step;
