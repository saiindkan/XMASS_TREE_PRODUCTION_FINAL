-- Disable RLS for the new simple reset password implementation
-- This ensures the new APIs will work without permission issues

-- Disable RLS on password_resets table
ALTER TABLE password_resets DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN 'RLS ENABLED' ELSE 'RLS DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename = 'password_resets';

-- Show current table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'password_resets'
ORDER BY ordinal_position;

-- Clean up any existing reset requests (optional)
-- DELETE FROM password_resets WHERE expires_at < NOW();

SELECT 'RLS has been disabled for password_resets table.' as result;
SELECT 'Your new simple reset password implementation should now work perfectly.' as next_step;
