-- Add order_number column to orders table
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

-- 2. Add order_number column if it doesn't exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_number TEXT;

-- 3. Make order_number NOT NULL and UNIQUE
-- First, update any existing NULL values with generated order numbers
UPDATE public.orders 
SET order_number = 'ORD-' || extract(epoch from created_at)::bigint || '-' || substr(md5(random()::text), 1, 4)
WHERE order_number IS NULL;

-- Then make it NOT NULL and UNIQUE
ALTER TABLE public.orders 
ALTER COLUMN order_number SET NOT NULL;

-- Add unique constraint
ALTER TABLE public.orders 
ADD CONSTRAINT IF NOT EXISTS unique_order_number UNIQUE (order_number);

-- 4. Add index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders (order_number);

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

-- 6. Check constraints
SELECT 'Constraints on orders table:' as info;
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'orders';

SELECT 'order_number column added and configured!' as status;
