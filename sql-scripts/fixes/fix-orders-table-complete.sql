-- Complete fix for orders table to support QR payments
-- This script ensures all required columns exist for the QR payment system

-- First, check current orders table structure
SELECT '📋 Current orders table structure:' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add all missing columns that QR payment system needs
DO $$ 
BEGIN
    -- Add customer_info column (JSONB for flexible customer data)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'customer_info'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN customer_info JSONB;
        RAISE NOTICE 'Added customer_info column to orders table';
    END IF;

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

    -- Add order_number column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'order_number'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN order_number TEXT UNIQUE;
        RAISE NOTICE 'Added order_number column to orders table';
    END IF;

    -- Add subtotal column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'subtotal'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0;
        RAISE NOTICE 'Added subtotal column to orders table';
    END IF;

    -- Add tax_amount column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'tax_amount'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN tax_amount DECIMAL(10,2) DEFAULT 0;
        RAISE NOTICE 'Added tax_amount column to orders table';
    END IF;

    -- Add shipping_amount column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'shipping_amount'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN shipping_amount DECIMAL(10,2) DEFAULT 0;
        RAISE NOTICE 'Added shipping_amount column to orders table';
    END IF;

    -- Add discount_amount column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'discount_amount'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
        RAISE NOTICE 'Added discount_amount column to orders table';
    END IF;

    -- Add currency column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'currency'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN currency TEXT DEFAULT 'usd';
        RAISE NOTICE 'Added currency column to orders table';
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

    -- Add user_id column if it doesn't exist (nullable for guest orders)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN user_id UUID;
        RAISE NOTICE 'Added user_id column to orders table';
    END IF;

    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added created_at column to orders table';
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to orders table';
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at);

-- Enable Row Level Security if not already enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create or replace policies for orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Service role can manage orders" ON public.orders;

CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can manage orders"
  ON public.orders
  FOR ALL
  USING (true);

-- Grant permissions
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.orders TO postgres;
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT SELECT, INSERT ON public.orders TO anon;

-- Verify the final orders table structure
SELECT '✅ Final orders table structure:' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Orders table fixed successfully for QR payments' as status;
