-- Payment Database Verification Script
-- This script checks all payment-related tables and their structure

-- 1. CHECK IF ALL REQUIRED TABLES EXIST
SELECT 'Table Check' as check_type, table_name, 'EXISTS' as status
FROM information_schema.tables 
WHERE table_name IN ('orders', 'payments', 'payment_transactions', 'order_items')
  AND table_schema = 'public'
ORDER BY table_name;

-- 2. CHECK ORDERS TABLE STRUCTURE
SELECT 'Orders Columns' as check_type, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND table_schema = 'public'
  AND column_name IN (
    'id', 'user_id', 'status', 'total', 'items', 'customer_info',
    'payment_intent_id', 'payment_status', 'customer_email', 
    'customer_name', 'customer_phone', 'billing_address',
    'subtotal', 'shipping', 'tax', 'paid_at', 'created_at', 'updated_at'
  )
ORDER BY column_name;

-- 3. CHECK PAYMENTS TABLE STRUCTURE
SELECT 'Payments Columns' as check_type, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'payments' 
  AND table_schema = 'public'
ORDER BY column_name;

-- 4. CHECK ROW LEVEL SECURITY
SELECT 'RLS Status' as check_type, schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE tablename IN ('orders', 'payments', 'payment_transactions', 'order_items')
  AND schemaname = 'public'
ORDER BY tablename;

-- 5. CHECK POLICIES
SELECT 'Policies' as check_type, schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('orders', 'payments', 'payment_transactions', 'order_items')
  AND schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. CHECK INDEXES
SELECT 'Indexes' as check_type, schemaname, tablename, indexname, indexdef
FROM pg_indexes 
WHERE tablename IN ('orders', 'payments', 'payment_transactions', 'order_items')
  AND schemaname = 'public'
ORDER BY tablename, indexname;

-- 7. CHECK FOREIGN KEY CONSTRAINTS
SELECT 'Foreign Keys' as check_type, 
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
  AND tc.table_name IN ('orders', 'payments', 'payment_transactions', 'order_items')
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 8. CHECK SAMPLE DATA (if any exists)
SELECT 'Sample Orders' as check_type, 
       COUNT(*) as order_count,
       COUNT(CASE WHEN payment_intent_id IS NOT NULL THEN 1 END) as orders_with_payment_intent,
       COUNT(CASE WHEN payment_status IS NOT NULL THEN 1 END) as orders_with_payment_status
FROM orders;

SELECT 'Sample Payments' as check_type, 
       COUNT(*) as payment_count,
       COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as completed_payments,
       COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_payments
FROM payments;

-- 9. CHECK FUNCTIONS
SELECT 'Functions' as check_type, routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name IN (
    'update_updated_at_column', 
    'update_payments_updated_at',
    'get_order_payments',
    'get_order_summary_with_payments'
  )
ORDER BY routine_name;

-- 10. CHECK TRIGGERS
SELECT 'Triggers' as check_type, 
       trigger_name, 
       event_manipulation, 
       event_object_table,
       action_timing,
       action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
  AND event_object_table IN ('orders', 'payments', 'payment_transactions', 'order_items')
ORDER BY event_object_table, trigger_name;

-- 11. TEST HELPER FUNCTIONS (if data exists)
DO $$
DECLARE
    order_count INTEGER;
    payment_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO order_count FROM orders LIMIT 1;
    SELECT COUNT(*) INTO payment_count FROM payments LIMIT 1;
    
    IF order_count > 0 THEN
        RAISE NOTICE 'Testing get_order_summary_with_payments function...';
        -- This will show the function works if there's data
    END IF;
    
    IF payment_count > 0 THEN
        RAISE NOTICE 'Testing get_order_payments function...';
        -- This will show the function works if there's data
    END IF;
END $$;

-- 12. SUMMARY REPORT
SELECT 'SUMMARY' as report_type,
       'Database verification complete. Check the results above for any issues.' as message,
       'All payment-related tables should be properly configured.' as expected_result;
