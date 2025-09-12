-- Fix QR payments table permissions
-- This script ensures proper permissions are granted for the qr_payments table

-- Grant all permissions to service_role (for API access)
GRANT ALL ON public.qr_payments TO service_role;

-- Grant all permissions to postgres (for admin access)
GRANT ALL ON public.qr_payments TO postgres;

-- Grant permissions to authenticated users
GRANT ALL ON public.qr_payments TO authenticated;

-- Grant permissions to anonymous users (if needed for public access)
GRANT ALL ON public.qr_payments TO anon;

-- Ensure the table owner has all permissions
ALTER TABLE public.qr_payments OWNER TO postgres;

-- Verify permissions
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename = 'qr_payments';

-- Check current permissions
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'qr_payments' 
AND table_schema = 'public';

SELECT 'QR payments permissions fixed successfully' as status;
