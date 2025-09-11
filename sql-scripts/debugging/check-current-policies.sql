-- Check Current RLS Policies on password_resets Table
-- This will show us exactly what policies exist and need to be modified

-- 1. Check if RLS is enabled
SELECT '=== RLS STATUS ===' as section;
SELECT 
    tablename,
    rowsecurity,
    CASE WHEN rowsecurity THEN 'RLS ENABLED' ELSE 'RLS DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename = 'password_resets';

-- 2. Check all existing policies
SELECT '=== EXISTING POLICIES ===' as section;
SELECT 
    policyname,
    permissive,
    cmd,
    qual,
    with_check,
    roles
FROM pg_policies 
WHERE tablename = 'password_resets'
ORDER BY policyname;

-- 3. Check policy details with more information
SELECT '=== DETAILED POLICY ANALYSIS ===' as section;
SELECT 
    p.policyname,
    p.permissive,
    p.cmd,
    p.qual,
    p.with_check,
    p.roles,
    CASE 
        WHEN p.qual IS NULL THEN 'No row filter'
        WHEN p.qual = 'true' THEN 'Allow all rows'
        ELSE 'Custom filter: ' || p.qual
    END as row_filter_description,
    CASE 
        WHEN p.with_check IS NULL THEN 'No insert/update filter'
        WHEN p.with_check = 'true' THEN 'Allow all inserts/updates'
        ELSE 'Custom insert/update filter: ' || p.with_check
    END as insert_update_filter_description
FROM pg_policies p
WHERE p.tablename = 'password_resets'
ORDER BY p.policyname;

-- 4. Check what roles can access the table
SELECT '=== ROLE ACCESS ANALYSIS ===' as section;
SELECT 
    r.rolname as role_name,
    r.rolcanlogin as can_login,
    r.rolsuper as is_superuser,
    r.rolcreaterole as can_create_roles,
    r.rolcreatedb as can_create_db
FROM pg_roles r
WHERE r.rolname IN (
    SELECT DISTINCT unnest(roles) 
    FROM pg_policies 
    WHERE tablename = 'password_resets'
)
ORDER BY r.rolname;

-- 5. Test current policy access
SELECT '=== CURRENT POLICY ACCESS TEST ===' as section;

-- Test if we can read with current policies
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM password_resets LIMIT 1)
        THEN '✅ READ access: SUCCESS'
        ELSE '❌ READ access: FAILED'
    END as read_test;

-- Test if we can update with current policies
UPDATE password_resets 
SET updated_at = NOW()
WHERE email = (SELECT email FROM password_resets LIMIT 1);

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM password_resets WHERE updated_at > created_at)
        THEN '✅ UPDATE access: SUCCESS'
        ELSE '❌ UPDATE access: FAILED'
    END as update_test;

-- 6. Show current user context
SELECT '=== CURRENT USER CONTEXT ===' as section;
SELECT 
    current_user,
    current_setting('role'),
    session_user,
    current_setting('application_name') as app_name;

-- 7. Summary and recommendations
SELECT '=== SUMMARY & RECOMMENDATIONS ===' as section;
SELECT 'This shows your current RLS policies and their effects.' as info;
SELECT 'Look for any ❌ FAILED access tests above.' as next_step;
SELECT 'We will modify the policies to fix any access issues.' as final_note;
