-- Add customer_id column to orders table
-- Run this in your Supabase SQL Editor

-- 1. Check current orders table structure
SELECT 'Current orders table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 2. Add customer_id column if it doesn't exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);

-- 3. Make customer_id NOT NULL (since every order should have a customer)
-- First set any existing NULL values to a placeholder (if any exist)
-- UPDATE public.orders SET customer_id = user_id WHERE customer_id IS NULL;

-- Then make it NOT NULL
-- ALTER TABLE public.orders ALTER COLUMN customer_id SET NOT NULL;

-- 4. Add index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders (customer_id);

-- 5. Verify the updated structure
SELECT 'Updated orders table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 6. Check foreign key constraints
SELECT 'Foreign key constraints on orders table:' as info;
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'orders' AND constraint_type = 'FOREIGN KEY';

SELECT 'customer_id column added to orders table!' as status;
