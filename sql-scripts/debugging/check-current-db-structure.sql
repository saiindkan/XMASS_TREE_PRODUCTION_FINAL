-- Check Current Database Structure for Reset Password Functionality
-- This will show us exactly what we have and what needs to be adjusted

-- 1. Check password_resets table structure
SELECT '=== PASSWORD_RESETS TABLE STRUCTURE ===' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name IN ('id', 'email', 'token', 'reset_token', 'expires_at', 'updated_at') 
        THEN '✅ REQUIRED'
        ELSE 'ℹ️ OPTIONAL'
    END as importance
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY ordinal_position;

-- 2. Check if required columns exist
SELECT '=== REQUIRED COLUMNS CHECK ===' as section;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'password_resets' AND column_name = 'id') 
        THEN '✅ id column exists'
        ELSE '❌ id column missing'
    END as id_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'password_resets' AND column_name = 'email') 
        THEN '✅ email column exists'
        ELSE '❌ email column missing'
    END as email_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'password_resets' AND column_name = 'token') 
        THEN '✅ token column exists'
        ELSE '❌ token column missing'
    END as token_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'password_resets' AND column_name = 'reset_token') 
        THEN '✅ reset_token column exists'
        ELSE '❌ reset_token column missing'
    END as reset_token_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'password_resets' AND column_name = 'expires_at') 
        THEN '✅ expires_at column exists'
        ELSE '❌ expires_at column missing'
    END as expires_at_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'password_resets' AND column_name = 'updated_at') 
        THEN '✅ updated_at column exists'
        ELSE '❌ updated_at column missing'
    END as updated_at_check;

-- 3. Check current data
SELECT '=== CURRENT DATA SAMPLE ===' as section;
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
LIMIT 3;

-- 4. Check RLS status
SELECT '=== RLS STATUS ===' as section;
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN 'RLS ENABLED' ELSE 'RLS DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename = 'password_resets';

-- 5. Check RLS policies
SELECT '=== RLS POLICIES ===' as section;
SELECT 
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'password_resets';

-- 6. Test basic operations
SELECT '=== BASIC OPERATIONS TEST ===' as section;

-- Test SELECT
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM password_resets LIMIT 1)
        THEN '✅ SELECT operation: SUCCESS'
        ELSE '❌ SELECT operation: FAILED'
    END as select_test;

-- Test INSERT (if we have data)
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM password_resets) > 0
        THEN '✅ Data exists for testing'
        ELSE '⚠️ No data exists - need to create test record'
    END as data_status;

-- 7. Summary and recommendations
SELECT '=== SUMMARY & RECOMMENDATIONS ===' as section;
SELECT 'This script shows what we have and what needs to be adjusted.' as info;
SELECT 'Look for any ❌ missing columns above.' as next_step;
