-- Test UPDATE operation - Simple test
-- This will show if UPDATE operations are working

-- 1. First, let's see what we have
SELECT '=== CURRENT STATE ===' as info;
SELECT COUNT(*) as total_records FROM password_resets;

-- 2. Try a simple UPDATE operation
SELECT '=== TESTING UPDATE ===' as info;

-- Test 1: Update a simple field
UPDATE password_resets 
SET updated_at = NOW() 
WHERE email = (SELECT email FROM password_resets LIMIT 1);

-- Check if it worked
SELECT 
    CASE 
        WHEN FOUND THEN '✅ UPDATE operation SUCCESSFUL'
        ELSE '⚠️ UPDATE operation: No rows affected (but no error)'
    END as update_result;

-- 3. Show the result
SELECT '=== UPDATE TEST COMPLETE ===' as info;
SELECT 'If you see "SUCCESSFUL" above, UPDATE operations work.' as success_note;
SELECT 'If you see an error, we know UPDATE is blocked.' as error_note;
