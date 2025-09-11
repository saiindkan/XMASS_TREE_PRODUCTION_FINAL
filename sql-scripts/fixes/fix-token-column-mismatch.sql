-- Fix token column mismatch between database and API
-- This aligns the password_resets table structure with your API expectations

-- 1. Check current table structure
SELECT '=== CURRENT TABLE STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY ordinal_position;

-- 2. Check what your API is trying to update
SELECT '=== API EXPECTATIONS ===' as info;
SELECT 'API expects: reset_token, expires_at, updated_at' as expected_columns;
SELECT 'API uses: .eq("email", email).eq("token", otp)' as where_clause;

-- 3. Fix the column structure to match your API

-- Option A: Rename existing 'token' column to 'reset_token' (if you want to keep existing data)
DO $$
BEGIN
    -- Check if we have both columns
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'password_resets' 
        AND column_name = 'token'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'password_resets' 
        AND column_name = 'reset_token'
    ) THEN
        -- Rename token to reset_token
        ALTER TABLE password_resets RENAME COLUMN token TO reset_token;
        RAISE NOTICE 'Renamed token column to reset_token';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'password_resets' 
        AND column_name = 'reset_token'
    ) THEN
        RAISE NOTICE 'reset_token column already exists';
    ELSE
        -- Add reset_token column
        ALTER TABLE password_resets ADD COLUMN reset_token TEXT;
        RAISE NOTICE 'Added reset_token column';
    END IF;
END $$;

-- 4. Update your API code to match the database structure
-- Instead of changing the database, let's make the API work with what you have

-- 5. Show the final structure
SELECT '=== FINAL TABLE STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY ordinal_position;

-- 6. Create a test record to verify structure
SELECT '=== TESTING STRUCTURE ===' as info;

DO $$
BEGIN
    -- Insert test record
    INSERT INTO password_resets (
        email, 
        reset_token,  -- Use reset_token if it exists, otherwise token
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
    
    RAISE NOTICE 'Test record inserted successfully';
    
    -- Clean up
    DELETE FROM password_resets WHERE email = 'test@example.com';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error: %', SQLERRM;
    
    -- Try with token column if reset_token doesn't exist
    BEGIN
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
        
        RAISE NOTICE 'Test record inserted with token column';
        
        -- Clean up
        DELETE FROM password_resets WHERE email = 'test@example.com';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Both attempts failed: %', SQLERRM;
    END;
END $$;

-- 7. Show the recommended API code changes
SELECT '=== RECOMMENDED API CHANGES ===' as info;
SELECT 'If you have reset_token column:' as scenario1;
SELECT '  .eq("email", email).eq("reset_token", otp)' as code1;
SELECT '' as blank;
SELECT 'If you have token column:' as scenario2;
SELECT '  .eq("email", email).eq("token", otp)' as code2;
SELECT '' as blank;
SELECT 'Update your API route.ts file accordingly!' as action;

-- 8. Success message
SELECT '✅ Token column mismatch analysis complete!' as status;
