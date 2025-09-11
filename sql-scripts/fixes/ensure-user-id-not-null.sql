-- Ensure user_id is NOT NULL in customers table
-- Run this in your Supabase SQL Editor

-- 1. Check current customers table structure
SELECT 'Current customers table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position;

-- 2. Make sure user_id is NOT NULL (if it was made nullable before)
ALTER TABLE public.customers 
ALTER COLUMN user_id SET NOT NULL;

-- 3. Verify the change
SELECT 'Updated customers table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position;

SELECT 'user_id is now properly set as NOT NULL!' as status;
