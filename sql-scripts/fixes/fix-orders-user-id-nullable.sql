-- Fix orders table to allow null user_id for guest orders
-- This script makes user_id nullable to support guest checkout

-- Check current user_id column constraints
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders' 
AND column_name = 'user_id';

-- Make user_id column nullable to support guest orders
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Verify the change
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders' 
AND column_name = 'user_id';

SELECT 'user_id column is now nullable for guest orders' as status;
