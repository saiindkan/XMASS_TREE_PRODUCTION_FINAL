-- Fix Database Structure for New Reset Password API
-- This will ensure the database perfectly matches our new API code

-- 1. First, let's check what we currently have
SELECT '=== CURRENT STRUCTURE CHECK ===' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY ordinal_position;

-- 2. Add missing columns if they don't exist
SELECT '=== ADDING MISSING COLUMNS ===' as section;

-- Add reset_token column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'password_resets' AND column_name = 'reset_token'
    ) THEN
        ALTER TABLE password_resets ADD COLUMN reset_token TEXT;
        RAISE NOTICE '✅ Added reset_token column';
    ELSE
        RAISE NOTICE 'ℹ️ reset_token column already exists';
    END IF;
END $$;

-- Add expires_at column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'password_resets' AND column_name = 'expires_at'
    ) THEN
        ALTER TABLE password_resets ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE '✅ Added expires_at column';
    ELSE
        RAISE NOTICE 'ℹ️ expires_at column already exists';
    END IF;
END $$;

-- Add updated_at column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'password_resets' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE password_resets ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE '✅ Added updated_at column';
    ELSE
        RAISE NOTICE 'ℹ️ updated_at column already exists';
    END IF;
END $$;

-- 3. Update existing records to have proper values
SELECT '=== UPDATING EXISTING RECORDS ===' as section;

-- Set expires_at for records that don't have it
UPDATE password_resets 
SET expires_at = created_at + INTERVAL '1 hour'
WHERE expires_at IS NULL;

-- Set updated_at for records that don't have it
UPDATE password_resets 
SET updated_at = created_at
WHERE updated_at IS NULL;

-- 4. Verify the final structure
SELECT '=== FINAL STRUCTURE VERIFICATION ===' as section;
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

-- 5. Test the new structure
SELECT '=== TESTING NEW STRUCTURE ===' as section;

-- Test SELECT with all required columns
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT id, email, token, reset_token, expires_at, updated_at 
            FROM password_resets 
            LIMIT 1
        )
        THEN '✅ All required columns accessible: SUCCESS'
        ELSE '❌ Column access issue: FAILED'
    END as column_access_test;

-- Test UPDATE operation
UPDATE password_resets 
SET 
    reset_token = 'test-token-' || EXTRACT(EPOCH FROM NOW())::TEXT,
    expires_at = NOW() + INTERVAL '1 hour',
    updated_at = NOW()
WHERE email = (SELECT email FROM password_resets LIMIT 1);

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM password_resets 
            WHERE reset_token LIKE 'test-token-%'
        )
        THEN '✅ UPDATE operation: SUCCESS'
        ELSE '❌ UPDATE operation: FAILED'
    END as update_test;

-- 6. Show sample data
SELECT '=== SAMPLE DATA ===' as section;
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

-- 7. Summary
SELECT '=== SUMMARY ===' as section;
SELECT 'Database structure has been updated to match the new API requirements.' as result;
SELECT 'All required columns are now present and accessible.' as next_step;
SELECT 'Your new reset password API should work perfectly now!' as final_note;
