-- Fix payment transaction amounts (convert from cents to dollars)
-- Run this in your Supabase SQL Editor

-- 1. Check current payment transactions
SELECT 'Current payment transactions:' as info;
SELECT 
    id,
    order_id,
    amount,
    currency,
    status,
    payment_method_id,
    created_at
FROM public.payment_transactions 
ORDER BY created_at DESC
LIMIT 10;

-- 2. Fix amounts that are in cents (over $10 are likely in cents)
-- This assumes amounts over 10 are in cents and need to be converted to dollars
UPDATE public.payment_transactions 
SET amount = amount / 100
WHERE amount > 10 AND currency = 'usd';

-- 3. Show updated payment transactions
SELECT 'Updated payment transactions:' as info;
SELECT 
    id,
    order_id,
    amount,
    currency,
    status,
    payment_method_id,
    created_at
FROM public.payment_transactions 
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check which ones still have null payment_method_id
SELECT 'Transactions with null payment_method_id:' as info;
SELECT 
    id,
    order_id,
    amount,
    status,
    payment_method_id,
    stripe_payment_intent_id
FROM public.payment_transactions 
WHERE payment_method_id IS NULL
ORDER BY created_at DESC;

SELECT 'Payment amounts fixed!' as status;
