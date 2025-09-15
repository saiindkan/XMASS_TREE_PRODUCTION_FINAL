-- Fix orders table by adding missing customer_info column
-- This script adds the customer_info column to the orders table

-- Check if customer_info column exists
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders' 
AND column_name = 'customer_info';

-- Add customer_info column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'customer_info'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN customer_info JSONB;
        RAISE NOTICE 'Added customer_info column to orders table';
    ELSE
        RAISE NOTICE 'customer_info column already exists in orders table';
    END IF;
END $$;

-- Add other missing columns that might be needed
DO $$ 
BEGIN
    -- Add items column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'items'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN items JSONB;
        RAISE NOTICE 'Added items column to orders table';
    END IF;

    -- Add payment_method column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN payment_method TEXT;
        RAISE NOTICE 'Added payment_method column to orders table';
    END IF;

    -- Add payment_reference column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'payment_reference'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN payment_reference TEXT;
        RAISE NOTICE 'Added payment_reference column to orders table';
    END IF;

    -- Add notes column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'notes'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN notes TEXT;
        RAISE NOTICE 'Added notes column to orders table';
    END IF;
END $$;

-- Verify the orders table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders'
ORDER BY ordinal_position;

SELECT 'Orders table customer_info column fixed successfully' as status;
