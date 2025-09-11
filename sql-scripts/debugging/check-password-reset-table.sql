-- Check password_resets table structure and data
-- This will help diagnose the OTP verification issue

-- 1. Check if the table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'password_resets';

-- 2. Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'password_resets' 
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'password_resets';

-- 4. Check RLS policies
SELECT 
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'password_resets';

-- 5. Check if there are any OTP records
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_records,
    COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired_records
FROM password_resets;

-- 6. Show recent OTP records (if any)
SELECT 
    email,
    token,
    expires_at,
    created_at,
    updated_at
FROM password_resets 
ORDER BY created_at DESC 
LIMIT 5;
