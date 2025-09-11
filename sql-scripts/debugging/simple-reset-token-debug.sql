-- Simple Reset Token Debug - Quick and Clear Results
-- This will show us exactly what's blocking reset token generation

-- 1. Check table state
SELECT '=== TABLE STATE ===' as section;
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN 'RLS ENABLED' ELSE 'RLS DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename = 'password_resets';

-- 2. Check what records exist
SELECT '=== EXISTING RECORDS ===' as section;
SELECT 
    email,
    token,
    reset_token,
    created_at
FROM password_resets
ORDER BY created_at DESC
LIMIT 3;

-- 3. Check RLS policies
SELECT '=== RLS POLICIES ===' as section;
SELECT 
    policyname,
    cmd,
    with_check
FROM pg_policies 
WHERE tablename = 'password_resets';

-- 4. Test basic UPDATE (the operation your API needs)
SELECT '=== TESTING UPDATE OPERATION ===' as section;

-- First, show what we're trying to update
SELECT 'Record to update:' as info;
SELECT email, token FROM password_resets LIMIT 1;

-- Now test the UPDATE
UPDATE password_resets 
SET updated_at = NOW()
WHERE email = (SELECT email FROM password_resets LIMIT 1);

-- Check if UPDATE worked
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM password_resets WHERE updated_at > created_at)
        THEN '✅ UPDATE SUCCESSFUL'
        ELSE '❌ UPDATE FAILED'
    END as update_result;

-- 5. Test the exact operation your API does
SELECT '=== TESTING RESET TOKEN UPDATE ===' as section;

-- Try to update reset_token (like your API)
UPDATE password_resets 
SET 
    reset_token = 'test-token-' || NOW()::TEXT,
    expires_at = NOW() + INTERVAL '1 hour'
WHERE email = (SELECT email FROM password_resets LIMIT 1);

-- Check if reset_token update worked
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM password_resets WHERE reset_token LIKE 'test-token-%')
        THEN '✅ RESET TOKEN UPDATE SUCCESSFUL'
        ELSE '❌ RESET TOKEN UPDATE FAILED'
    END as reset_token_result;

-- 6. Show final state
SELECT '=== FINAL STATE ===' as section;
SELECT 
    email,
    token,
    reset_token,
    expires_at,
    updated_at
FROM password_resets
LIMIT 1;

-- 7. Summary
SELECT '=== SUMMARY ===' as section;
SELECT 'If you see ❌ above, that tells us exactly what is blocking reset token generation.' as note;
