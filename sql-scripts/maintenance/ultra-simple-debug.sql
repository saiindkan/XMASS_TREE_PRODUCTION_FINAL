-- Ultra simple debug - Only basic SELECT statements
-- This will show the basic table status without any complex operations

-- 1. Check if table exists and is accessible
SELECT '=== BASIC TABLE ACCESS ===' as info;
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'password_resets';

-- 2. Check table structure (simple)
SELECT '=== TABLE STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY ordinal_position;

-- 3. Check RLS status (simple)
SELECT '=== RLS STATUS ===' as info;
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'password_resets';

-- 4. Check policies (simple)
SELECT '=== POLICIES ===' as info;
SELECT 
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'password_resets'
ORDER BY policyname;

-- 5. Check if we can read the table at all
SELECT '=== CAN WE READ TABLE? ===' as info;
SELECT COUNT(*) as total_records FROM password_resets;

-- 6. Show a few records if any exist
SELECT '=== SAMPLE RECORDS ===' as info;
SELECT 
    email,
    token,
    created_at
FROM password_resets
ORDER BY created_at DESC
LIMIT 3;

-- 7. Summary
SELECT '=== SUMMARY ===' as info;
SELECT 'This shows basic table access and structure.' as note;
SELECT 'If any step fails, we know where the problem is.' as explanation;
