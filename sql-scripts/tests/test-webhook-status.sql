-- Test Webhook Status Updates
-- This script helps verify that payment webhooks are properly updating order status

-- =====================================================
-- 1. CHECK CURRENT ORDER STATUSES
-- =====================================================

SELECT '📊 CURRENT ORDER STATUSES' as info;
SELECT 
  id,
  status as old_status,
  order_status as new_order_status,
  payment_status,
  payment_intent_id,
  stripe_payment_intent_id,
  created_at,
  updated_at
FROM public.orders 
ORDER BY created_at DESC 
LIMIT 10;

-- =====================================================
-- 2. CHECK FOR ORDERS WITH PAYMENT INTENT IDS
-- =====================================================

SELECT '🔍 ORDERS WITH PAYMENT INTENT IDS' as info;
SELECT 
  id,
  status,
  order_status,
  payment_status,
  payment_intent_id,
  stripe_payment_intent_id,
  CASE 
    WHEN payment_intent_id IS NOT NULL THEN '✅ New field populated'
    WHEN stripe_payment_intent_id IS NOT NULL THEN '⚠️ Old field populated'
    ELSE '❌ No payment intent ID'
  END as payment_intent_status
FROM public.orders 
WHERE payment_intent_id IS NOT NULL 
   OR stripe_payment_intent_id IS NOT NULL
ORDER BY created_at DESC;

-- =====================================================
-- 3. CHECK FOR ORDERS THAT SHOULD BE UPDATED
-- =====================================================

SELECT '⚠️ ORDERS THAT NEED STATUS UPDATE' as info;
SELECT 
  id,
  status,
  order_status,
  payment_status,
  payment_intent_id,
  stripe_payment_intent_id,
  CASE 
    WHEN status = 'pending_payment' AND payment_intent_id IS NOT NULL THEN '🔄 Ready for webhook update'
    WHEN status = 'pending_payment' AND stripe_payment_intent_id IS NOT NULL THEN '🔄 Ready for webhook update (old field)'
    WHEN status = 'paid' THEN '✅ Already updated'
    ELSE '❓ Unknown state'
  END as update_status
FROM public.orders 
WHERE status = 'pending_payment' 
   OR status = 'paid'
ORDER BY created_at DESC;

-- =====================================================
-- 4. MANUAL STATUS UPDATE TEST (if needed)
-- =====================================================

-- Uncomment and modify this section if you need to manually update a test order
/*
SELECT '🛠️ MANUAL UPDATE TEST' as info;
-- Example: Update a test order to simulate webhook success
UPDATE public.orders 
SET 
  status = 'paid',
  order_status = 'paid',
  payment_status = 'succeeded',
  payment_confirmed_at = NOW(),
  updated_at = NOW()
WHERE id = 'your-test-order-id-here';

SELECT '✅ Manual update completed' as result;
*/

-- =====================================================
-- 5. WEBHOOK CONFIGURATION CHECK
-- =====================================================

SELECT '🔧 WEBHOOK CONFIGURATION CHECK' as info;
SELECT 
  'Stripe Webhook Endpoint' as setting,
  'https://your-domain.com/api/webhooks/stripe' as expected_value,
  'Verify this matches your Stripe dashboard' as note
UNION ALL
SELECT 
  'Webhook Events' as setting,
  'payment_intent.succeeded, payment_intent.payment_failed, payment_intent.canceled' as expected_value,
  'Ensure these events are configured in Stripe' as note
UNION ALL
SELECT 
  'Environment Variable' as setting,
  'STRIPE_WEBHOOK_SECRET' as expected_value,
  'Check if this is set in your environment' as note;

-- =====================================================
-- 6. TROUBLESHOOTING TIPS
-- =====================================================

SELECT '💡 TROUBLESHOOTING TIPS' as info;
SELECT 
  'Check Stripe Dashboard' as tip,
  'Verify webhook endpoint is active and receiving events' as description
UNION ALL
SELECT 
  'Check Environment Variables' as tip,
  'Ensure STRIPE_WEBHOOK_SECRET is correctly set' as description
UNION ALL
SELECT 
  'Check Server Logs' as tip,
  'Look for webhook receipt and processing logs' as description
UNION ALL
SELECT 
  'Test Webhook' as tip,
  'Use Stripe CLI to test webhook delivery' as description
UNION ALL
SELECT 
  'Verify Database Connection' as tip,
  'Ensure webhook can connect to Supabase' as description;
