                                                                                            h-- Check the last payment and order data
-- Run this to diagnose what happened with the last payment

-- 1. Check the most recent orders
SELECT 
  id,
  order_number,
  user_id,
  customer_id,
  customer_email,
  customer_name,
  total,
  status,
  payment_status,
  payment_intent_id,
  created_at,
  updated_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Check the most recent payments
SELECT 
  id,
  order_id,
  amount,
  payment_method,
  payment_status,
  transaction_id,
  payment_date,
  created_at
FROM payments 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Check customers for the recent orders
SELECT 
  c.id,
  c.user_id,
  c.email,
  c.first_name,
  c.last_name,
  c.created_at,
  o.order_number,
  o.total,
  o.status
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
ORDER BY c.created_at DESC 
LIMIT 10;

-- 4. Check if there are any orders without customers
SELECT 
  o.id,
  o.order_number,
  o.user_id,
  o.customer_id,
  o.customer_email,
  o.status,
  o.created_at
FROM orders o
WHERE o.customer_id IS NULL
ORDER BY o.created_at DESC;

-- 5. Check if there are any orders without payment records
SELECT 
  o.id,
  o.order_number,
  o.total,
  o.status,
  o.payment_status,
  o.payment_intent_id,
  o.created_at,
  p.id as payment_id
FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
WHERE p.id IS NULL AND o.status = 'paid'
ORDER BY o.created_at DESC;

-- 6. Check the database schema for orders table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 7. Check the database schema for payments table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'payments' 
ORDER BY ordinal_position;

-- 8. Check for any constraint violations
SELECT 
  tc.table_schema as schemaname,
  tc.table_name as tablename,
  tc.constraint_name as constraintname,
  tc.constraint_type as constrainttype
FROM information_schema.table_constraints tc
WHERE tc.table_name IN ('orders', 'payments', 'customers')
ORDER BY tc.table_name, tc.constraint_name;

-- 9. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('orders', 'payments', 'customers')
ORDER BY tablename, policyname;

-- 10. Check for any recent errors in the database
SELECT 
  backend_start,
  state,
  query,
  application_name
FROM pg_stat_activity 
WHERE state = 'active' AND query IS NOT NULL
ORDER BY backend_start DESC 
LIMIT 10;

-- 11. Check table row counts
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables 
WHERE tablename IN ('orders', 'payments', 'customers')
ORDER BY tablename;
