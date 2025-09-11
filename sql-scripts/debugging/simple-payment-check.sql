-- Simple Payment Check - Supabase Compatible
-- Run this to check the last payment status

-- 1. Most recent orders (last 5)
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

-- 2. Most recent payments (last 5)
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

-- 3. Check if orders have corresponding payments
SELECT 
  o.id as order_id,
  o.order_number,
  o.total as order_total,
  o.status as order_status,
  o.payment_status,
  p.id as payment_id,
  p.amount as payment_amount,
  p.payment_status as payment_status,
  CASE 
    WHEN p.id IS NULL THEN 'MISSING PAYMENT RECORD'
    WHEN o.total != p.amount THEN 'AMOUNT MISMATCH'
    ELSE 'OK'
  END as status_check
FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
WHERE o.status = 'paid' OR o.payment_status = 'succeeded'
ORDER BY o.created_at DESC 
LIMIT 10;

-- 4. Check customers for recent orders
SELECT 
  c.id as customer_id,
  c.user_id,
  c.email as customer_email,
  c.first_name,
  c.last_name,
  c.created_at as customer_created,
  o.id as order_id,
  o.order_number,
  o.total,
  o.status as order_status
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
ORDER BY c.created_at DESC 
LIMIT 10;

-- 5. Check for orphaned orders (no customer)
SELECT 
  id,
  order_number,
  user_id,
  customer_id,
  customer_email,
  status,
  created_at
FROM orders 
WHERE customer_id IS NULL
ORDER BY created_at DESC;

-- 6. Check for orphaned payments (no order)
SELECT 
  p.id,
  p.order_id,
  p.amount,
  p.payment_method,
  p.payment_status,
  p.transaction_id,
  p.created_at,
  o.id as order_exists
FROM payments p
LEFT JOIN orders o ON p.order_id = o.id
WHERE o.id IS NULL
ORDER BY p.created_at DESC;
