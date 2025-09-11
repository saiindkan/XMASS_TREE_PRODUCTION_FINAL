-- Fix permissions only for tables that actually exist
-- Run this in your Supabase SQL Editor

-- 1. Check what tables actually exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
    table_name LIKE '%order%' OR 
    table_name LIKE '%customer%' OR 
    table_name LIKE '%payment%' OR
    table_name LIKE '%item%'
)
ORDER BY table_name;

-- 2. Grant permissions for tables that exist
-- Only grant if table exists
DO $$
BEGIN
    -- customers table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customers') THEN
        EXECUTE 'GRANT ALL ON public.customers TO service_role';
        EXECUTE 'GRANT ALL ON public.customers TO postgres';
        EXECUTE 'DROP POLICY IF EXISTS "Service role can access all customers" ON public.customers';
        EXECUTE 'CREATE POLICY "Service role can access all customers" ON public.customers FOR ALL USING (true)';
    END IF;

    -- orders table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
        EXECUTE 'GRANT ALL ON public.orders TO service_role';
        EXECUTE 'GRANT ALL ON public.orders TO postgres';
        EXECUTE 'DROP POLICY IF EXISTS "Service role can access all orders" ON public.orders';
        EXECUTE 'CREATE POLICY "Service role can access all orders" ON public.orders FOR ALL USING (true)';
    END IF;

    -- order_items table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order_items') THEN
        EXECUTE 'GRANT ALL ON public.order_items TO service_role';
        EXECUTE 'GRANT ALL ON public.order_items TO postgres';
        EXECUTE 'DROP POLICY IF EXISTS "Service role can access all order_items" ON public.order_items';
        EXECUTE 'CREATE POLICY "Service role can access all order_items" ON public.order_items FOR ALL USING (true)';
    END IF;

    -- payment_transactions table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payment_transactions') THEN
        EXECUTE 'GRANT ALL ON public.payment_transactions TO service_role';
        EXECUTE 'GRANT ALL ON public.payment_transactions TO postgres';
        EXECUTE 'DROP POLICY IF EXISTS "Service role can access all payment_transactions" ON public.payment_transactions';
        EXECUTE 'CREATE POLICY "Service role can access all payment_transactions" ON public.payment_transactions FOR ALL USING (true)';
    END IF;

    -- customer_addresses table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customer_addresses') THEN
        EXECUTE 'GRANT ALL ON public.customer_addresses TO service_role';
        EXECUTE 'GRANT ALL ON public.customer_addresses TO postgres';
        EXECUTE 'DROP POLICY IF EXISTS "Service role can access all customer_addresses" ON public.customer_addresses';
        EXECUTE 'CREATE POLICY "Service role can access all customer_addresses" ON public.customer_addresses FOR ALL USING (true)';
    END IF;

END $$;

-- 3. Grant sequence permissions (for auto-incrementing IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 4. Show what was fixed
SELECT 'Permissions fixed for existing tables' as status;

-- 5. Show tables that now have service_role access
SELECT 
    table_name,
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND grantee = 'service_role'
AND table_name IN ('customers', 'orders', 'order_items', 'payment_transactions', 'customer_addresses')
ORDER BY table_name, privilege_type;
