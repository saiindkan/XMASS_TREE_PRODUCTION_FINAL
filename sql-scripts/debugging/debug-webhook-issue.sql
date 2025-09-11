-- Debug Webhook Issue and Fix Order Statuses
-- This script helps identify and fix the pending payment issue

-- =====================================================
-- 1. DIAGNOSE CURRENT SITUATION
-- =====================================================

SELECT '🔍 DIAGNOSIS: Current Order Statuses' as info;
SELECT 
  id,
  status as old_status,
  order_status as new_order_status,
  payment_status,
  payment_intent_id,
  stripe_payment_intent_id,
  created_at,
  updated_at,
  CASE 
    WHEN payment_intent_id IS NOT NULL THEN '✅ Has new payment intent ID'
    WHEN stripe_payment_intent_id IS NOT NULL THEN '⚠️ Has old payment intent ID'
    ELSE '❌ No payment intent ID'
  END as payment_intent_status
FROM public.orders 
ORDER BY created_at DESC 
LIMIT 10;

-- =====================================================
-- 2. IDENTIFY ORDERS THAT SHOULD BE PAID
-- =====================================================

SELECT '⚠️ ORDERS THAT SHOULD BE PAID' as info;
SELECT 
  id,
  status,
  order_status,
  payment_status,
  payment_intent_id,
  stripe_payment_intent_id,
  created_at,
  'This order has a payment intent but still shows pending' as issue
FROM public.orders 
WHERE (payment_intent_id IS NOT NULL OR stripe_payment_intent_id IS NOT NULL)
  AND status = 'pending_payment'
ORDER BY created_at DESC;

-- =====================================================
-- 3. CHECK FOR ORDERS WITH SUCCESSFUL PAYMENTS
-- =====================================================

SELECT '💰 ORDERS WITH PAYMENT INTENT IDS' as info;
SELECT 
  id,
  status,
  order_status,
  payment_status,
  COALESCE(payment_intent_id, stripe_payment_intent_id) as payment_intent,
  created_at,
  CASE 
    WHEN status = 'paid' THEN '✅ Already marked as paid'
    WHEN status = 'pending_payment' THEN '🔄 Needs webhook update'
    ELSE '❓ Unknown status'
  END as action_needed
FROM public.orders 
WHERE payment_intent_id IS NOT NULL 
   OR stripe_payment_intent_id IS NOT NULL
ORDER BY created_at DESC;

-- =====================================================
-- 4. MANUAL FIX FOR TESTING (if webhook isn't working)
-- =====================================================

-- Uncomment this section if you want to manually fix the status for testing
/*
SELECT '🛠️ MANUAL FIX: Updating Test Order Status' as info;

-- Update the most recent order with payment intent to simulate webhook success
UPDATE public.orders 
SET 
  status = 'paid',
  order_status = 'paid',
  payment_status = 'succeeded',
  payment_confirmed_at = NOW(),
  updated_at = NOW()
WHERE id = (
  SELECT id FROM public.orders 
  WHERE (payment_intent_id IS NOT NULL OR stripe_payment_intent_id IS NOT NULL)
    AND status = 'pending_payment'
  ORDER BY created_at DESC 
  LIMIT 1
);

SELECT '✅ Manual status update completed' as result;
*/

-- =====================================================
-- 5. WEBHOOK CONFIGURATION CHECKLIST
-- =====================================================

SELECT '🔧 WEBHOOK CONFIGURATION CHECKLIST' as info;
SELECT 
  'Stripe Dashboard' as step,
  'Go to Developers → Webhooks' as action,
  'Verify endpoint is active' as check
UNION ALL
SELECT 
  'Webhook URL' as step,
  'https://your-domain.com/api/webhooks/stripe' as action,
  'Ensure this matches your actual domain' as check
UNION ALL
SELECT 
  'Webhook Events' as step,
  'payment_intent.succeeded, payment_intent.payment_failed, payment_intent.canceled' as action,
  'Verify these events are selected' as check
UNION ALL
SELECT 
  'Webhook Secret' as step,
  'Copy from Stripe dashboard' as action,
  'Add to STRIPE_WEBHOOK_SECRET env var' as check
UNION ALL
SELECT 
  'Test Webhook' as step,
  'Use Stripe CLI or dashboard test' as action,
  'Verify endpoint receives events' as check;

-- =====================================================
-- 6. TROUBLESHOOTING STEPS
-- =====================================================

SELECT '🚨 TROUBLESHOOTING STEPS' as info;
SELECT 
  '1. Check Stripe Dashboard' as step,
  'Look for webhook delivery attempts and failures' as action
UNION ALL
SELECT 
  '2. Check Server Logs' as step,
  'Look for webhook receipt logs and errors' as action
UNION ALL
SELECT 
  '3. Test Webhook Endpoint' as step,
  'Use Stripe CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe' as action
UNION ALL
SELECT 
  '4. Verify Environment Variables' as step,
  'Check STRIPE_WEBHOOK_SECRET and Supabase credentials' as action
UNION ALL
SELECT 
  '5. Check Network Access' as step,
  'Ensure your webhook endpoint is publicly accessible' as action;

-- =====================================================
-- 7. IMMEDIATE ACTION ITEMS
-- =====================================================

SELECT '⚡ IMMEDIATE ACTION ITEMS' as info;
SELECT 
  'Check Stripe Dashboard' as priority,
  'Verify webhook endpoint exists and is active' as action,
  'HIGH' as urgency
UNION ALL
SELECT 
  'Check Server Logs' as priority,
  'Look for webhook receipt messages' as action,
  'HIGH' as urgency
UNION ALL
SELECT 
  'Verify Environment Variables' as priority,
  'Ensure STRIPE_WEBHOOK_SECRET is set' as action,
  'HIGH' as urgency
UNION ALL
SELECT 
  'Test Webhook Manually' as priority,
  'Use Stripe dashboard to send test event' as action,
  'MEDIUM' as urgency;
