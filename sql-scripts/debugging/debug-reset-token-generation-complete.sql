-- Complete debug of reset token generation - Find out exactly why it's failing
-- This will check the database end and see what's happening with the reset token

-- 1. Check current table state
SELECT '=== CURRENT TABLE STATE ===' as info;
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

-- 3. Check RLS policies
SELECT '=== CURRENT RLS POLICIES ===' as info;
SELECT 
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'password_resets'
ORDER BY policyname;

-- 4. Test the exact UPDATE operation your API is doing
SELECT '=== TESTING EXACT API UPDATE OPERATION ===' as info;

-- First, let's see what we're working with
SELECT 'Sample record to test with:' as test_info;
SELECT 
    email,
    token,
    reset_token,
    expires_at,
    updated_at
FROM password_resets 
LIMIT 1;

-- Now test the EXACT UPDATE operation your API does
SELECT 'Testing UPDATE operation (like your API)...' as test_phase;

-- Test 1: Update with reset_token (your API's first attempt)
UPDATE password_resets 
SET 
    reset_token = 'test-reset-token-' || EXTRACT(EPOCH FROM NOW())::TEXT,
    expires_at = NOW() + INTERVAL '1 hour',
    updated_at = NOW()
WHERE email = (SELECT email FROM password_resets LIMIT 1)
AND token = (SELECT token FROM password_resets LIMIT 1);

-- Check if it worked
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM password_resets 
            WHERE reset_token LIKE 'test-reset-token-%'
        ) THEN '✅ First UPDATE (reset_token) SUCCESSFUL'
        ELSE '❌ First UPDATE (reset_token) FAILED - No rows affected'
    END as first_update_result;

-- Show the result
SELECT 'After first UPDATE:' as result_phase;
SELECT 
    email,
    token,
    reset_token,
    expires_at,
    updated_at
FROM password_resets 
LIMIT 1;

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

-- 7. Check if there are any row-level security functions
SELECT '=== CHECKING FOR RLS FUNCTIONS ===' as info;
SELECT 
    proname,
    prosrc
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND prosrc ILIKE '%password_resets%'
AND prosrc ILIKE '%auth%';

-- 8. Test basic permissions
SELECT '=== TESTING BASIC PERMISSIONS ===' as info;

-- Can we read?
SELECT 'Testing READ permission...' as test_type;
SELECT COUNT(*) as can_read FROM password_resets;

-- Can we insert?
SELECT 'Testing INSERT permission...' as test_type;
INSERT INTO password_resets (
    email, 
    token, 
    expires_at, 
    created_at, 
    updated_at
) VALUES (
    'test@debug.com', 
    'debug-token-123', 
    NOW() + INTERVAL '1 hour', 
    NOW(), 
    NOW()
);

-- Check if insert worked
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM password_resets WHERE email = 'test@debug.com') 
        THEN '✅ INSERT permission: SUCCESS'
        ELSE '❌ INSERT permission: FAILED'
    END as insert_result;

-- Can we update the test record?
SELECT 'Testing UPDATE permission on test record...' as test_type;
UPDATE password_resets 
SET reset_token = 'debug-reset-token-456'
WHERE email = 'test@debug.com';

-- Check if update worked
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM password_resets WHERE email = 'test@debug.com' AND reset_token = 'debug-reset-token-456')
        THEN '✅ UPDATE permission: SUCCESS'
        ELSE '❌ UPDATE permission: FAILED'
    END as update_result;

-- Clean up test record
DELETE FROM password_resets WHERE email = 'test@debug.com';

-- 9. Check current user and role
SELECT '=== CURRENT USER CONTEXT ===' as info;
SELECT 
    current_user,
    current_setting('role'),
    session_user,
    current_setting('application_name') as app_name;

-- 10. Summary and findings
SELECT '=== DIAGNOSTIC SUMMARY ===' as info;
SELECT 'This script has tested:' as tests_completed;
SELECT '  - Table state and RLS status' as item1;
SELECT '  - Existing records and data' as item2;
SELECT '  - RLS policies' as item3;
SELECT '  - EXACT UPDATE operation your API does' as item4;
SELECT '  - Triggers and constraints' as item5;
SELECT '  - Basic permissions (READ, INSERT, UPDATE)' as item6;
SELECT '  - Current user context' as item7;
SELECT '' as blank;
SELECT 'Look at the results above to see exactly where the reset token generation is failing.' as next_step;
