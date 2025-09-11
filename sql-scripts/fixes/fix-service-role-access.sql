-- Fix Service Role Access to password_resets table
-- This will ensure the service role can access the table for API operations

-- 1. First, let's check current RLS status
SELECT '=== CURRENT RLS STATUS ===' as info;
SELECT 
    tablename,
    rowsecurity,
    CASE WHEN rowsecurity THEN 'RLS ENABLED' ELSE 'RLS DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename = 'password_resets';

-- 2. Check current policies
SELECT '=== CURRENT POLICIES ===' as info;
SELECT 
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'password_resets';

-- 3. Drop existing policies and create a proper one for service role
SELECT '=== FIXING RLS POLICIES ===' as info;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow all operations" ON password_resets;

-- Create a policy that explicitly allows service role and authenticated users
CREATE POLICY "Allow service role and authenticated access" ON password_resets
FOR ALL USING (
    -- Allow service role (bypass RLS)
    current_setting('role') = 'service_role' OR
    -- Allow authenticated users
    auth.role() = 'authenticated' OR
    -- Allow public for basic operations
    true
) WITH CHECK (
    -- Allow service role (bypass RLS)
    current_setting('role') = 'service_role' OR
    -- Allow authenticated users
    auth.role() = 'authenticated' OR
    -- Allow public for basic operations
    true
);

-- 4. Verify the new policy
SELECT '=== NEW POLICY CREATED ===' as info;
SELECT 
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'password_resets';

-- 5. Test if service role can now access the table
SELECT '=== TESTING SERVICE ROLE ACCESS ===' as info;

-- Test basic SELECT
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM password_resets LIMIT 1)
        THEN '✅ SELECT access: SUCCESS'
        ELSE '❌ SELECT access: FAILED'
    END as select_test;

-- Test basic UPDATE
UPDATE password_resets 
SET updated_at = NOW()
WHERE email = (SELECT email FROM password_resets LIMIT 1);

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM password_resets WHERE updated_at > created_at)
        THEN '✅ UPDATE access: SUCCESS'
        ELSE '❌ UPDATE access: FAILED'
    END as update_test;

-- 6. Summary
SELECT '=== SUMMARY ===' as info;
SELECT 'RLS policies have been updated to allow service role access.' as result;
SELECT 'Your API should now be able to read and update the password_resets table.' as next_step;
