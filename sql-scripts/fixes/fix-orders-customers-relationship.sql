-- Fix the foreign key relationship between orders and customers tables
-- This script ensures the proper relationship is established

-- First, check current foreign key constraints
SELECT '📋 Current foreign key constraints on orders table:' as info;
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'orders'
AND tc.table_schema = 'public';

-- Ensure customers table exists with proper structure
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop existing foreign key constraint if it exists
DO $$ 
BEGIN
    -- Drop any existing foreign key constraint on customer_id
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'orders' 
        AND table_schema = 'public'
        AND constraint_name LIKE '%customer_id%'
    ) THEN
        ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
        RAISE NOTICE 'Dropped existing foreign key constraint on customer_id';
    END IF;
END $$;

-- Add the foreign key constraint properly
ALTER TABLE public.orders 
ADD CONSTRAINT orders_customer_id_fkey 
FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;

-- Create the ensure_customer_exists function
CREATE OR REPLACE FUNCTION public.ensure_customer_exists(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
    customer_uuid UUID;
BEGIN
    -- Check if customer already exists for this user
    SELECT id INTO customer_uuid 
    FROM public.customers 
    WHERE user_id = user_uuid;
    
    -- If not found, create a new customer record
    IF customer_uuid IS NULL THEN
        INSERT INTO public.customers (user_id, first_name, last_name, email)
        VALUES (user_uuid, 'Customer', 'User', 'user@example.com')
        RETURNING id INTO customer_uuid;
    END IF;
    
    RETURN customer_uuid;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions on customers table
GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.customers TO postgres;
GRANT SELECT, INSERT, UPDATE ON public.customers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.customers TO anon;

-- Enable RLS on customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table
DROP POLICY IF EXISTS "Users can view their own customer record" ON public.customers;
DROP POLICY IF EXISTS "Users can create their own customer record" ON public.customers;
DROP POLICY IF EXISTS "Service role can manage customers" ON public.customers;

CREATE POLICY "Users can view their own customer record"
  ON public.customers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customer record"
  ON public.customers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage customers"
  ON public.customers
  FOR ALL
  USING (true);

-- Verify the foreign key constraint was created
SELECT '📋 Updated foreign key constraints on orders table:' as info;
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'orders'
AND tc.table_schema = 'public';

-- Test the function
SELECT '🧪 Testing ensure_customer_exists function:' as info;
-- This will create a test customer if needed
-- SELECT public.ensure_customer_exists('00000000-0000-0000-0000-000000000000'::UUID);

SELECT 'Orders-customers relationship fixed successfully' as status;
