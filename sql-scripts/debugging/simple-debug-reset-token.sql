-- Simple debug reset token generation - No complex DO blocks
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

-- 4. Test basic operations step by step
SELECT '=== TESTING BASIC OPERATIONS ===' as info;

-- Test 1: Can we read records?
SELECT 'Test 1: Reading records' as test_name;
SELECT COUNT(*) as total_records FROM password_resets;

-- Test 2: Can we see specific records?
SELECT 'Test 2: Viewing specific records' as test_name;
SELECT email, token, reset_token FROM password_resets LIMIT 3;

-- Test 3: Check if we can update a simple field
SELECT 'Test 3: Testing simple UPDATE' as test_name;
-- This will show if UPDATE works at all
SELECT 'If you see this, basic SELECT works' as status;

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

-- 7. Check table permissions
SELECT '=== TABLE PERMISSIONS ===' as info;
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'password_resets'
AND grantee IN (current_user, 'authenticated', 'service_role', 'postgres');

-- 8. Manual UPDATE test (simple)
SELECT '=== MANUAL UPDATE TEST ===' as info;
SELECT 'Try this UPDATE manually in your SQL editor:' as instruction;
SELECT 'UPDATE password_resets SET updated_at = NOW() WHERE email = (SELECT email FROM password_resets LIMIT 1);' as test_query;
SELECT 'If this fails, we know UPDATE operations are blocked.' as explanation;

-- 9. Summary of findings
SELECT '=== DIAGNOSTIC SUMMARY ===' as info;
SELECT 'This script shows the basic table state and permissions.' as instruction;
SELECT 'Look for:' as focus;
SELECT '  - Whether records exist and are readable' as item1;
SELECT '  - RLS status and policies' as item2;
SELECT '  - Any triggers or constraints' as item3;
SELECT '  - Table permissions for your user' as item4;
SELECT '  - Try the manual UPDATE test above' as item5;
