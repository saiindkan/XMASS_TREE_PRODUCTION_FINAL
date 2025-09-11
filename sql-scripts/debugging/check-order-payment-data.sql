-- Check Order Payment Data
-- This script examines what payment information is available in the orders table

-- Check orders table structure for payment-related columns
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'orders'
    AND column_name IN ('status', 'payment_intent_id', 'payment_status', 'paid_at', 'payment_method')
ORDER BY ordinal_position;

-- Check sample order data to see what payment information is stored
SELECT 
    id,
    order_number,
    status,
    payment_intent_id,
    payment_status,
    paid_at,
    payment_method,
    total,
    created_at,
    updated_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- Count orders by status
SELECT 
    status,
    COUNT(*) as count
FROM orders 
GROUP BY status 
ORDER BY count DESC;

-- Check if any orders have payment_intent_id
SELECT 
    COUNT(*) as orders_with_payment_intent,
    COUNT(CASE WHEN payment_intent_id IS NOT NULL THEN 1 END) as orders_with_payment_intent_id
FROM orders;

-- Check orders with paid_at timestamp
SELECT 
    COUNT(*) as total_orders,
    COUNT(CASE WHEN paid_at IS NOT NULL THEN 1 END) as orders_with_paid_at
FROM orders;
