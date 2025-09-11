-- Fix permissions for orders system tables
-- Run this in your Supabase SQL Editor

-- 1. Check what order-related tables exist
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

-- 2. Grant permissions to service_role for all order-related tables
GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.customers TO postgres;

GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.orders TO postgres;

GRANT ALL ON public.order_items TO service_role;
GRANT ALL ON public.order_items TO postgres;

GRANT ALL ON public.payment_transactions TO service_role;
GRANT ALL ON public.payment_transactions TO postgres;

GRANT ALL ON public.customer_addresses TO service_role;
GRANT ALL ON public.customer_addresses TO postgres;

-- 3. Create policies for service role access (drop first if exists)
DROP POLICY IF EXISTS "Service role can access all customers" ON public.customers;
CREATE POLICY "Service role can access all customers" ON public.customers
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role can access all orders" ON public.orders;
CREATE POLICY "Service role can access all orders" ON public.orders
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role can access all order_items" ON public.order_items;
CREATE POLICY "Service role can access all order_items" ON public.order_items
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role can access all payment_transactions" ON public.payment_transactions;
CREATE POLICY "Service role can access all payment_transactions" ON public.payment_transactions
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role can access all customer_addresses" ON public.customer_addresses;
CREATE POLICY "Service role can access all customer_addresses" ON public.customer_addresses
    FOR ALL USING (true);

-- 4. Grant sequence permissions (for auto-incrementing IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 5. Verify permissions were granted
SELECT 
    'customers' as table_name,
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'customers' AND grantee = 'service_role'
UNION ALL
SELECT 
    'orders' as table_name,
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'orders' AND grantee = 'service_role'
ORDER BY table_name, privilege_type;

-- 6. Success message
SELECT 'Orders system permissions fixed successfully' as status;
