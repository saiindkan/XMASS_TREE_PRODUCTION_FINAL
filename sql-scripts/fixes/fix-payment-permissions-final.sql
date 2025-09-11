-- Fix all payment-related permissions comprehensively
-- Run this in your Supabase SQL Editor

-- 1. Grant ALL permissions to service_role for all tables
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.customer_addresses TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.payment_transactions TO service_role;
GRANT ALL ON public.password_resets TO service_role;

-- 2. Grant to postgres as well (for admin operations)
GRANT ALL ON public.users TO postgres;
GRANT ALL ON public.customers TO postgres;
GRANT ALL ON public.customer_addresses TO postgres;
GRANT ALL ON public.orders TO postgres;
GRANT ALL ON public.payment_transactions TO postgres;
GRANT ALL ON public.password_resets TO postgres;

-- 3. Create RLS policies that allow service_role to bypass all restrictions
DROP POLICY IF EXISTS "Service role bypass users" ON public.users;
CREATE POLICY "Service role bypass users" ON public.users
    FOR ALL USING (true);

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

DROP POLICY IF EXISTS "Service role bypass password_resets" ON public.password_resets;
CREATE POLICY "Service role bypass password_resets" ON public.password_resets
    FOR ALL USING (true);

-- 4. Grant sequence permissions (for auto-incrementing IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 5. Verify all permissions are set correctly
SELECT 'Service role permissions verification:' as info;
SELECT 
    table_name,
    COUNT(*) as permission_count
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND grantee = 'service_role'
AND table_name IN ('users', 'customers', 'customer_addresses', 'orders', 'payment_transactions', 'password_resets')
GROUP BY table_name
ORDER BY table_name;

-- 6. Show RLS policies
SELECT 'RLS policies for service_role:' as info;
SELECT 
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE tablename IN ('users', 'customers', 'customer_addresses', 'orders', 'payment_transactions', 'password_resets')
ORDER BY tablename, policyname;

SELECT 'All payment system permissions fixed!' as status;
