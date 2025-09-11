-- Test Complete API Flow - Mimics Your verify-otp Route Exactly
-- This will show us exactly where your API is failing

-- 1. First, let's see what we're working with
SELECT '=== STEP 1: CHECK EXISTING DATA ===' as step;
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

-- 2. Test the EXACT WHERE clause your API uses
SELECT '=== STEP 2: TEST API WHERE CLAUSE ===' as step;

-- Your API does: .eq('email', email).eq('token', otp)
-- Let's test this exact condition
SELECT 'Testing WHERE clause: email = ? AND token = ?' as test_info;

-- Get a sample record to test with
SELECT 'Sample record for testing:' as info;
SELECT 
    email,
    token,
    reset_token
FROM password_resets 
LIMIT 1;

-- 3. Test the EXACT UPDATE operation your API does
SELECT '=== STEP 3: TEST EXACT API UPDATE ===' as step;

-- Your API generates:
-- resetToken = crypto.randomUUID()
-- expiresAt = new Date() + 1 hour
-- updated_at = new Date()

-- Let's simulate this exactly
DO $$
DECLARE
    test_email TEXT;
    test_token TEXT;
    test_reset_token TEXT;
    test_expires_at TIMESTAMP;
    update_count INTEGER;
BEGIN
    -- Get a sample record
    SELECT email, token INTO test_email, test_token 
    FROM password_resets 
    LIMIT 1;
    
    -- Generate test values like your API
    test_reset_token := 'test-api-token-' || EXTRACT(EPOCH FROM NOW())::TEXT;
    test_expires_at := NOW() + INTERVAL '1 hour';
    
    RAISE NOTICE 'Testing with: Email=%, Token=%, ResetToken=%, ExpiresAt=%', 
        test_email, test_token, test_reset_token, test_expires_at;
    
    -- Test the EXACT UPDATE your API does
    UPDATE password_resets 
    SET 
        reset_token = test_reset_token,
        expires_at = test_expires_at,
        updated_at = NOW()
    WHERE email = test_email 
    AND token = test_token;
    
    GET DIAGNOSTICS update_count = ROW_COUNT;
    
    IF update_count > 0 THEN
        RAISE NOTICE '✅ API UPDATE SUCCESSFUL: % rows updated', update_count;
    ELSE
        RAISE NOTICE '❌ API UPDATE FAILED: No rows updated';
    END IF;
    
    -- Show the result
    RAISE NOTICE 'After UPDATE:';
    RAISE NOTICE 'Email: %, Token: %, ResetToken: %, ExpiresAt: %', 
        (SELECT email FROM password_resets WHERE email = test_email),
        (SELECT token FROM password_resets WHERE email = test_email),
        (SELECT reset_token FROM password_resets WHERE email = test_email),
        (SELECT expires_at FROM password_resets WHERE email = test_email);
        
END $$;

-- 4. Verify the update worked
SELECT '=== STEP 4: VERIFY UPDATE RESULT ===' as step;
SELECT 
    email,
    token,
    reset_token,
    expires_at,
    updated_at
FROM password_resets
WHERE reset_token LIKE 'test-api-token-%'
ORDER BY updated_at DESC
LIMIT 1;

-- 5. Test the retry logic your API has
SELECT '=== STEP 5: TEST API RETRY LOGIC ===' as step;

-- Your API has a retry that tries updating 'token' column instead of 'reset_token'
-- Let's test this fallback logic
DO $$
DECLARE
    test_email TEXT;
    test_token TEXT;
    test_reset_token TEXT;
    update_count INTEGER;
BEGIN
    -- Get a sample record
    SELECT email, token INTO test_email, test_token 
    FROM password_resets 
    LIMIT 1;
    
    -- Generate new test token
    test_reset_token := 'test-retry-token-' || EXTRACT(EPOCH FROM NOW())::TEXT;
    
    RAISE NOTICE 'Testing retry logic: Update token column instead of reset_token';
    
    -- Test the retry UPDATE (your API's fallback)
    UPDATE password_resets 
    SET 
        token = test_reset_token,  -- Note: updating 'token' not 'reset_token'
        updated_at = NOW()
    WHERE email = test_email 
    AND token = test_token;
    
    GET DIAGNOSTICS update_count = ROW_COUNT;
    
    IF update_count > 0 THEN
        RAISE NOTICE '✅ RETRY UPDATE SUCCESSFUL: % rows updated', update_count;
    ELSE
        RAISE NOTICE '❌ RETRY UPDATE FAILED: No rows updated';
    END IF;
    
END $$;

-- 6. Final verification
SELECT '=== STEP 6: FINAL VERIFICATION ===' as step;
SELECT 
    email,
    token,
    reset_token,
    expires_at,
    updated_at
FROM password_resets
ORDER BY updated_at DESC
LIMIT 3;

-- 7. Summary
SELECT '=== SUMMARY ===' as step;
SELECT 'This test has mimicked your API flow exactly:' as info;
SELECT '  - Checked existing data' as item1;
SELECT '  - Tested WHERE clause conditions' as item2;
SELECT '  - Tested exact UPDATE operation' as item3;
SELECT '  - Verified update results' as item4;
SELECT '  - Tested retry logic' as item5;
SELECT '  - Final verification' as item6;
SELECT '' as blank;
SELECT 'If all steps show ✅ SUCCESS, then your API should work.' as conclusion;
SELECT 'If any step shows ❌ FAILED, that tells us exactly where the problem is.' as next_step;
