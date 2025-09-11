-- Test UPDATE operation - Fixed version
-- This will show if UPDATE operations are working

-- 1. First, let's see what we have
SELECT '=== CURRENT STATE ===' as info;
SELECT COUNT(*) as total_records FROM password_resets;

-- 2. Show a sample record before update
SELECT '=== SAMPLE RECORD BEFORE UPDATE ===' as info;
SELECT 
    email,
    updated_at
FROM password_resets 
LIMIT 1;

-- 3. Try a simple UPDATE operation
SELECT '=== TESTING UPDATE ===' as info;

-- Test 1: Update a simple field
UPDATE password_resets 
SET updated_at = NOW() 
WHERE email = (SELECT email FROM password_resets LIMIT 1);

-- 4. Show the result after update
SELECT '=== SAMPLE RECORD AFTER UPDATE ===' as info;
SELECT 
    email,
    updated_at
FROM password_resets 
LIMIT 1;

-- 5. Check if the update worked by comparing timestamps
SELECT '=== UPDATE TEST RESULT ===' as info;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM password_resets 
            WHERE updated_at > (NOW() - INTERVAL '1 minute')
        ) THEN '✅ UPDATE operation SUCCESSFUL - updated_at was changed recently'
        ELSE '⚠️ UPDATE operation may have failed - no recent updates found'
    END as update_result;

-- 6. Summary
SELECT '=== SUMMARY ===' as info;
SELECT 'If you see different timestamps above, UPDATE is working.' as success_note;
SELECT 'If timestamps are the same, UPDATE may be blocked.' as error_note;
