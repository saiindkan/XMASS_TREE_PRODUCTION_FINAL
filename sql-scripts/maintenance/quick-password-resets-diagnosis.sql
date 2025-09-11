-- Quick password_resets diagnosis - Check essential structure
-- This will quickly identify what's missing

-- 1. Check what columns exist
SELECT '=== CURRENT COLUMNS ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY ordinal_position;

-- 2. Check if reset_token column exists
SELECT '=== RESET_TOKEN COLUMN CHECK ===' as info;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'password_resets' 
            AND column_name = 'reset_token'
        ) THEN '✅ reset_token column EXISTS'
        ELSE '❌ reset_token column MISSING - This is the problem!'
    END as reset_token_status;

-- 3. Check RLS status
SELECT '=== RLS STATUS ===' as info;
SELECT 
    CASE 
        WHEN rowsecurity THEN 'RLS ENABLED'
        ELSE 'RLS DISABLED'
    END as rls_status
FROM pg_tables 
WHERE tablename = 'password_resets';

-- 4. Check policies
SELECT '=== RLS POLICIES ===' as info;
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'password_resets'
ORDER BY policyname;

-- 5. Test if we can update anything
SELECT '=== UPDATE TEST ===' as info;

DO $$
BEGIN
    -- Try to update a simple field
    UPDATE password_resets 
    SET updated_at = NOW()
    WHERE email = (SELECT email FROM password_resets LIMIT 1);
    
    IF FOUND THEN
        RAISE NOTICE '✅ UPDATE operation: SUCCESS';
    ELSE
        RAISE NOTICE '⚠️ UPDATE operation: No rows affected (but no error)';
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ UPDATE operation: FAILED - %', SQLERRM;
END $$;

-- 6. Summary
SELECT '=== DIAGNOSIS SUMMARY ===' as info;
SELECT 'If reset_token column is missing, that explains the API errors.' as note1;
SELECT 'If UPDATE test fails, RLS policies are still blocking operations.' as note2;
SELECT 'Run the fix script after seeing these results.' as next_step;
