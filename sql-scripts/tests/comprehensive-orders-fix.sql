-- Comprehensive fix for orders system
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what tables exist
SELECT 'Current tables in database:' as info;
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check if customers table exists and its structure
SELECT 'Customers table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position;

-- 3. Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create customer_addresses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    address_type TEXT NOT NULL, -- 'billing' or 'shipping'
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'US',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'pending_payment',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create payment_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL, -- 'pending', 'succeeded', 'failed', 'canceled'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Grant ALL permissions to service_role for all tables
GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.customers TO postgres;

GRANT ALL ON public.customer_addresses TO service_role;
GRANT ALL ON public.customer_addresses TO postgres;

GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.orders TO postgres;

GRANT ALL ON public.payment_transactions TO service_role;
GRANT ALL ON public.payment_transactions TO postgres;

-- 8. Enable RLS on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- 9. Create policies that allow service_role to bypass RLS
DROP POLICY IF EXISTS "Service role bypass customers" ON public.customers;
CREATE POLICY "Service role bypass customers" ON public.customers
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role bypass customer_addresses" ON public.customer_addresses;
CREATE POLICY "Service role bypass customer_addresses" ON public.customer_addresses
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role bypass orders" ON public.orders;
CREATE POLICY "Service role bypass orders" ON public.orders
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role bypass payment_transactions" ON public.payment_transactions;
CREATE POLICY "Service role bypass payment_transactions" ON public.payment_transactions
    FOR ALL USING (true);

-- 10. Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 11. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers (user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers (email);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON public.customer_addresses (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON public.payment_transactions (order_id);

-- 12. Verify everything is set up correctly
SELECT 'Setup verification:' as info;

SELECT 'Tables created:' as check;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('customers', 'customer_addresses', 'orders', 'payment_transactions')
ORDER BY table_name;

SELECT 'Service role permissions:' as check;
SELECT 
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND grantee = 'service_role'
AND table_name IN ('customers', 'customer_addresses', 'orders', 'payment_transactions')
ORDER BY table_name, privilege_type;

SELECT 'Orders system setup complete!' as status;
