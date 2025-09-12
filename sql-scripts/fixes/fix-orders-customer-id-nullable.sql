-- Fix orders table to allow null customer_id or make it same as user_id
-- This script handles the customer_id constraint issue

-- Check current customer_id column constraints
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders' 
AND column_name = 'customer_id';

-- Option 1: Make customer_id nullable
ALTER TABLE public.orders ALTER COLUMN customer_id DROP NOT NULL;

-- Option 2: Update existing records to set customer_id = user_id where customer_id is null
UPDATE public.orders 
SET customer_id = user_id 
WHERE customer_id IS NULL AND user_id IS NOT NULL;

-- Verify the change
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders' 
AND column_name = 'customer_id';

SELECT 'customer_id column is now nullable and existing records updated' as status;
