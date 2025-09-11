-- Check table constraints and triggers that might be blocking updates - FULLY COMPATIBLE
-- This will identify what's preventing the service role from updating the table

-- 1. Check all table constraints
SELECT '=== TABLE CONSTRAINTS ===' as info;
SELECT 
    constraint_name,
    constraint_type,
    table_name,
    is_deferrable,
    initially_deferred
FROM information_schema.table_constraints 
WHERE table_name = 'password_resets'
ORDER BY constraint_type, constraint_name;

-- 2. Check column constraints - FIXED with proper aliases
SELECT '=== COLUMN CONSTRAINTS ===' as info;
SELECT 
    tc.table_name,
    ccu.column_name,
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.constraint_column_usage ccu
JOIN information_schema.table_constraints tc ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'password_resets'
ORDER BY ccu.column_name, tc.constraint_type;

-- 3. Check for triggers that might interfere
SELECT '=== TRIGGERS ===' as info;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'password_resets'
ORDER BY trigger_name;

-- 4. Check for any rules (simplified for compatibility)
SELECT '=== RULES ===' as info;
SELECT 
    rulename,
    tablename,
    is_instead
FROM pg_rules 
WHERE tablename = 'password_resets';

-- 5. Check table ownership and permissions
SELECT '=== TABLE OWNERSHIP ===' as info;
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'password_resets';

-- 6. Check if there are any foreign key constraints
SELECT '=== FOREIGN KEY CONSTRAINTS ===' as info;
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'password_resets';

-- 7. Check for any check constraints that might block updates
SELECT '=== CHECK CONSTRAINTS ===' as info;
SELECT 
    tc.constraint_name,
    cc.check_clause
FROM information_schema.check_constraints cc
JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'password_resets'
AND tc.constraint_type = 'CHECK';

-- 8. Test a simple UPDATE to see what specific error we get
SELECT '=== TESTING SIMPLE UPDATE ===' as info;

DO $$
DECLARE
    test_email TEXT;
BEGIN
    -- Get an existing email to test with
    SELECT email INTO test_email
    FROM password_resets 
    LIMIT 1;
    
    IF test_email IS NOT NULL THEN
        RAISE NOTICE 'Testing simple UPDATE on email: %', test_email;
        
        -- Try the simplest possible UPDATE
        UPDATE password_resets 
        SET updated_at = NOW()
        WHERE email = test_email;
        
        IF FOUND THEN
            RAISE NOTICE 'Simple UPDATE: SUCCESS';
        ELSE
            RAISE NOTICE 'Simple UPDATE: No rows affected';
        END IF;
        
    ELSE
        RAISE NOTICE 'No existing records found for UPDATE test';
        
        -- Try to create a test record first
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
        
        -- Now try to update it
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
    RAISE NOTICE 'UPDATE test failed with error: %', SQLERRM;
    RAISE NOTICE 'Error code: %', SQLSTATE;
END $$;

-- 9. Check if there are any row-level security functions
SELECT '=== RLS FUNCTIONS ===' as info;
SELECT 
    proname,
    prosrc
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND prosrc ILIKE '%password_resets%'
AND prosrc ILIKE '%auth%';

-- 10. Check table structure to see what columns exist
SELECT '=== TABLE STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY ordinal_position;

-- 11. Summary and next steps
SELECT '=== DIAGNOSTIC SUMMARY ===' as info;
SELECT 'This script will reveal what constraints or triggers are blocking updates.' as instruction;
SELECT 'Look for:' as focus;
SELECT '  - CHECK constraints that might validate data' as item1;
SELECT '  - Triggers that might fire on UPDATE' as item2;
SELECT '  - Foreign key constraints' as item3;
SELECT '  - Rules that might override UPDATE behavior' as item4;
SELECT '  - Missing columns that your API expects' as item5;
