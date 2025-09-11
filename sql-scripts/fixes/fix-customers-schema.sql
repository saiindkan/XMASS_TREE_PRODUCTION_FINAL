-- Fix customers table schema to allow NULL user_id
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

-- 2. Make user_id nullable (allow guest checkouts)
ALTER TABLE public.customers 
ALTER COLUMN user_id DROP NOT NULL;

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

-- 4. Add an index on user_id for performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers (user_id);

SELECT 'Customers table schema fixed - user_id is now nullable!' as status;
