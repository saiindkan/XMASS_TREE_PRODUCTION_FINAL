-- Database Schema Check and Comparison Script
-- Run this in your Supabase SQL Editor to see current schema vs. expected schema

-- =====================================================
-- 1. CHECK CURRENT TABLE STRUCTURE
-- =====================================================

-- Check if all expected tables exist
SELECT '📋 TABLE EXISTENCE CHECK' as info;
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('users', 'orders', 'order_items', 'payment_transactions', 'customer_addresses', 'password_resets') 
    THEN '✅ EXPECTED' 
    ELSE '❌ UNEXPECTED' 
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =====================================================
-- 2. ORDERS TABLE STRUCTURE CHECK
-- =====================================================

SELECT '📊 ORDERS TABLE STRUCTURE' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN (
      'id', 'user_id', 'status', 'stripe_payment_intent_id', 'subtotal', 'tax_amount', 
      'shipping_amount', 'discount_amount', 'currency', 'items', 'customer_info', 
      'shipping_address_id', 'billing_address_id', 'estimated_delivery_date', 
      'tracking_number', 'notes', 'paid_at', 'created_at', 'updated_at', 'total',
      'payment_method_id', 'customer_first_name', 'customer_last_name', 'customer_email',
      'customer_phone', 'customer_company', 'billing_address_line1', 'billing_address_line2',
      'billing_city', 'billing_state', 'billing_postal_code', 'billing_country',
      'shipping_address_line1', 'shipping_address_line2', 'shipping_city', 'shipping_state',
      'shipping_postal_code', 'shipping_country', 'shipping_same_as_billing',
      'payment_status', 'payment_method_type', 'payment_intent_id', 'payment_confirmed_at',
      'payment_failed_at', 'payment_failure_reason', 'order_status', 'processing_notes',
      'shipped_at', 'delivered_at'
    ) THEN '✅ EXPECTED'
    ELSE '❌ UNEXPECTED'
  END as expected_status
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- 3. USERS TABLE STRUCTURE CHECK
-- =====================================================

SELECT '👤 USERS TABLE STRUCTURE' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN ('id', 'email', 'name', 'created_at', 'updated_at', 'auth_id') 
    THEN '✅ EXPECTED' 
    ELSE '❌ UNEXPECTED' 
  END as expected_status
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- 4. ORDER_ITEMS TABLE STRUCTURE CHECK
-- =====================================================

SELECT '📦 ORDER_ITEMS TABLE STRUCTURE' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN ('id', 'order_id', 'product_id', 'product_name', 'quantity', 'price', 'total_price') 
    THEN '✅ EXPECTED' 
    ELSE '❌ UNEXPECTED' 
  END as expected_status
FROM information_schema.columns 
WHERE table_name = 'order_items' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- 5. PAYMENT_TRANSACTIONS TABLE STRUCTURE CHECK
-- =====================================================

SELECT '💳 PAYMENT_TRANSACTIONS TABLE STRUCTURE' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN ('id', 'order_id', 'payment_intent_id', 'amount', 'currency', 'status', 'created_at') 
    THEN '✅ EXPECTED' 
    ELSE '❌ UNEXPECTED' 
  END as expected_status
FROM information_schema.columns 
WHERE table_name = 'payment_transactions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- 6. CUSTOMER_ADDRESSES TABLE STRUCTURE CHECK
-- =====================================================

SELECT '🏠 CUSTOMER_ADDRESSES TABLE STRUCTURE' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN ('id', 'user_id', 'order_id', 'type', 'name', 'address', 'address_1', 'city', 'state', 'zip_code', 'country', 'created_at', 'updated_at') 
    THEN '✅ EXPECTED' 
    ELSE '❌ UNEXPECTED' 
  END as expected_status
FROM information_schema.columns 
WHERE table_name = 'customer_addresses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- 7. PASSWORD_RESETS TABLE STRUCTURE CHECK
-- =====================================================

SELECT '🔐 PASSWORD_RESETS TABLE STRUCTURE' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN ('id', 'email', 'token', 'created_at', 'expires_at') 
    THEN '✅ EXPECTED' 
    ELSE '❌ UNEXPECTED' 
  END as expected_status
FROM information_schema.columns 
WHERE table_name = 'password_resets' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- 8. CHECK FOR MISSING TABLES
-- =====================================================

SELECT '🔍 MISSING TABLES CHECK' as info;
SELECT 
  'orders' as expected_table,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'users' as expected_table,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'order_items' as expected_table,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'payment_transactions' as expected_table,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_transactions' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'customer_addresses' as expected_table,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customer_addresses' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'password_resets' as expected_table,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'password_resets' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- =====================================================
-- 9. CHECK FOR MISSING COLUMNS IN ORDERS TABLE
-- =====================================================

SELECT '⚠️ MISSING COLUMNS IN ORDERS TABLE' as info;
SELECT 
  'customer_first_name' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_first_name' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'customer_last_name' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_last_name' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'customer_email' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_email' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'customer_phone' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_phone' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'customer_company' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_company' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'billing_address_line1' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_address_line1' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'billing_address_line2' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_address_line2' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'billing_city' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_city' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'billing_state' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_state' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'billing_postal_code' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_postal_code' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'billing_country' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_country' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'shipping_address_line1' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_address_line1' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'shipping_address_line2' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_address_line2' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'shipping_city' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_city' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'shipping_state' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_state' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'shipping_postal_code' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_postal_code' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'shipping_country' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_country' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'shipping_same_as_billing' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_same_as_billing' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'payment_status' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_status' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'payment_method_id' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method_id' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'payment_method_type' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method_type' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'payment_intent_id' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_intent_id' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'payment_confirmed_at' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_confirmed_at' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'payment_failed_at' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_failed_at' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'payment_failure_reason' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_failure_reason' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'order_status' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_status' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'processing_notes' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'processing_notes' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'estimated_delivery_date' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'estimated_delivery_date' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'tracking_number' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tracking_number' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'shipped_at' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipped_at' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'delivered_at' as expected_column,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivered_at' AND table_schema = 'public') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- =====================================================
-- 10. SUMMARY AND RECOMMENDATIONS
-- =====================================================

SELECT '📋 SUMMARY AND RECOMMENDATIONS' as info;
SELECT 
  'Run the migrate-orders-table-step-by-step.sql script' as recommendation,
  'This will add all missing columns to the orders table' as description
UNION ALL
SELECT 
  'Check if all tables exist' as recommendation,
  'Ensure users, orders, order_items, payment_transactions, customer_addresses, password_resets exist' as description
UNION ALL
SELECT 
  'Verify column data types' as recommendation,
  'Ensure TEXT, JSONB, TIMESTAMPTZ columns are properly set' as description
UNION ALL
SELECT 
  'Check for indexes' as recommendation,
  'Ensure proper indexes exist for performance' as description;
