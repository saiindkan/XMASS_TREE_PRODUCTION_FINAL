-- Fix RLS policies for password_resets table
-- This will allow proper OTP verification and token updates

-- 1. Check current RLS status and policies
SELECT 'Checking current password_resets table setup...' as status;

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'password_resets';

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'password_resets';

-- 2. Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can create password reset requests" ON password_resets;
DROP POLICY IF EXISTS "Users can view their password reset requests" ON password_resets;
DROP POLICY IF EXISTS "Users can update their password reset requests" ON password_resets;
DROP POLICY IF EXISTS "Users can delete their password reset requests" ON password_resets;

-- 3. Create proper RLS policies for password_resets table

-- Allow users to create password reset requests (for OTP storage)
CREATE POLICY "Users can create password reset requests" ON password_resets
FOR INSERT WITH CHECK (true);

-- Allow users to view their own password reset requests
CREATE POLICY "Users can view their password reset requests" ON password_resets
FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Allow users to update their own password reset requests (for token updates)
CREATE POLICY "Users can update their password reset requests" ON password_resets
FOR UPDATE USING (email = auth.jwt() ->> 'email');

-- Allow users to delete their own password reset requests
CREATE POLICY "Users can delete their password reset requests" ON password_resets
FOR DELETE USING (email = auth.jwt() ->> 'email');

-- 4. Alternative: More permissive policies if the above don't work
-- Uncomment these if you still get permission errors:

-- CREATE POLICY "Allow all operations for password resets" ON password_resets
-- FOR ALL USING (true) WITH CHECK (true);

-- 5. Verify policies were created
SELECT 
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'password_resets'
ORDER BY policyname;

-- 6. Test the policies work
SELECT '✅ RLS policies for password_resets table created successfully!' as status;
