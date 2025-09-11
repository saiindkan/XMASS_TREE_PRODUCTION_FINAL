-- Simple password_resets table check - Universal compatibility
-- This will identify what's preventing updates without any version-specific columns

-- 1. Check basic table structure
SELECT '=== TABLE STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY ordinal_position;

-- 2. Check if RLS is enabled
SELECT '=== RLS STATUS ===' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'password_resets';

-- 3. Check current policies
SELECT '=== CURRENT POLICIES ===' as info;
SELECT 
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE tablename = 'password_resets'
ORDER BY policyname;

-- 4. Check table constraints
SELECT '=== TABLE CONSTRAINTS ===' as info;
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'password_resets'
ORDER BY constraint_type, constraint_name;

-- 5. Check for triggers
SELECT '=== TRIGGERS ===' as info;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'password_resets'
ORDER BY trigger_name;

-- 6. Test basic table access
SELECT '=== BASIC ACCESS TEST ===' as info;

-- Try to count rows
SELECT COUNT(*) as total_records FROM password_resets;

-- 7. Test simple UPDATE operation
SELECT '=== UPDATE TEST ===' as info;

DO $$
DECLARE
    test_email TEXT;
BEGIN
    -- Get an existing email to test with
    SELECT email INTO test_email
    FROM password_resets 
    LIMIT 1;
    
    IF test_email IS NOT NULL THEN
        RAISE NOTICE 'Testing UPDATE on existing email: %', test_email;
        
        -- Try the simplest possible UPDATE
        UPDATE password_resets 
        SET updated_at = NOW()
        WHERE email = test_email;
        
        IF FOUND THEN
            RAISE NOTICE 'UPDATE: SUCCESS';
        ELSE
            RAISE NOTICE 'UPDATE: No rows affected';
        END IF;
        
    ELSE
        RAISE NOTICE 'No existing records found';
        
        -- Try to create a test record
        INSERT INTO password_resets (
            email, 
            token, 
            expires_at, 
            created_at, 
            updated_at
        ) VALUES (
            'test@example.com', 
            'test123', 
            NOW() + INTERVAL '1 hour', 
            NOW(), 
            NOW()
        );
        
        RAISE NOTICE 'Test record created successfully';
        
        -- Try to update it
        UPDATE password_resets 
        SET updated_at = NOW()
        WHERE email = 'test@example.com';
        
        IF FOUND THEN
            RAISE NOTICE 'UPDATE on test record: SUCCESS';
        ELSE
            RAISE NOTICE 'UPDATE on test record: No rows affected';
        END IF;
        
        -- Clean up
        DELETE FROM password_resets WHERE email = 'test@example.com';
        
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Operation failed with error: %', SQLERRM;
    RAISE NOTICE 'Error code: %', SQLSTATE;
END $$;

-- 8. Check what records exist
SELECT '=== EXISTING RECORDS ===' as info;
SELECT 
    email,
    token,
    created_at,
    updated_at
FROM password_resets
ORDER BY created_at DESC
LIMIT 5;

-- 9. Summary
SELECT '=== SUMMARY ===' as info;
SELECT 'This script shows the basic table structure and tests basic operations.' as note;
SELECT 'Look for any constraints, triggers, or missing columns that might block updates.' as instruction;
