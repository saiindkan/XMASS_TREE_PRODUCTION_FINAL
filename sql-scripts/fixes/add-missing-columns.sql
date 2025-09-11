-- Add Missing Columns to Orders Table
-- This script adds the remaining columns that the code expects

-- =====================================================
-- 1. ADD MISSING CUSTOMER FIELDS
-- =====================================================

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS customer_company TEXT;

-- =====================================================
-- 2. ADD MISSING BILLING ADDRESS FIELDS
-- =====================================================

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS billing_address_line1 TEXT,
ADD COLUMN IF NOT EXISTS billing_address_line2 TEXT,
ADD COLUMN IF NOT EXISTS billing_city TEXT,
ADD COLUMN IF NOT EXISTS billing_state TEXT,
ADD COLUMN IF NOT EXISTS billing_postal_code TEXT,
ADD COLUMN IF NOT EXISTS billing_country TEXT DEFAULT 'US';

-- =====================================================
-- 3. ADD MISSING SHIPPING ADDRESS FIELDS
-- =====================================================

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_address_line1 TEXT,
ADD COLUMN IF NOT EXISTS shipping_address_line2 TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_state TEXT,
ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT,
ADD COLUMN IF NOT EXISTS shipping_country TEXT DEFAULT 'US',
ADD COLUMN IF NOT EXISTS shipping_same_as_billing BOOLEAN DEFAULT true;

-- =====================================================
-- 4. ADD MISSING PAYMENT FIELDS
-- =====================================================

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_method_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method_type TEXT,
ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_failed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_failure_reason TEXT;

-- =====================================================
-- 5. ADD MISSING ORDER PROCESSING FIELDS
-- =====================================================

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS processing_notes TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- =====================================================
-- 6. ADD COMMENTS FOR CLARITY
-- =====================================================

COMMENT ON COLUMN public.orders.customer_phone IS 'Customer phone number for contact';
COMMENT ON COLUMN public.orders.customer_company IS 'Customer company name (optional)';
COMMENT ON COLUMN public.orders.billing_address_line1 IS 'Primary billing address line';
COMMENT ON COLUMN public.orders.billing_address_line2 IS 'Secondary billing address line (optional)';
COMMENT ON COLUMN public.orders.billing_city IS 'Billing address city';
COMMENT ON COLUMN public.orders.billing_state IS 'Billing address state/province';
COMMENT ON COLUMN public.orders.billing_postal_code IS 'Billing address postal/zip code';
COMMENT ON COLUMN public.orders.billing_country IS 'Billing address country (default: US)';
COMMENT ON COLUMN public.orders.shipping_address_line1 IS 'Primary shipping address line';
COMMENT ON COLUMN public.orders.shipping_address_line2 IS 'Secondary shipping address line (optional)';
COMMENT ON COLUMN public.orders.shipping_city IS 'Shipping address city';
COMMENT ON COLUMN public.orders.shipping_state IS 'Shipping address state/province';
COMMENT ON COLUMN public.orders.shipping_postal_code IS 'Shipping address postal/zip code';
COMMENT ON COLUMN public.orders.shipping_country IS 'Shipping address country (default: US)';
COMMENT ON COLUMN public.orders.shipping_same_as_billing IS 'Whether shipping address is same as billing';
COMMENT ON COLUMN public.orders.payment_method_id IS 'Stripe payment method ID';
COMMENT ON COLUMN public.orders.payment_method_type IS 'Type of payment method (card, etc.)';
COMMENT ON COLUMN public.orders.payment_confirmed_at IS 'When payment was confirmed';
COMMENT ON COLUMN public.orders.payment_failed_at IS 'When payment failed';
COMMENT ON COLUMN public.orders.payment_failure_reason IS 'Reason for payment failure';
COMMENT ON COLUMN public.orders.processing_notes IS 'Internal notes for order processing';
COMMENT ON COLUMN public.orders.estimated_delivery_date IS 'Estimated delivery date';
COMMENT ON COLUMN public.orders.tracking_number IS 'Shipping tracking number';
COMMENT ON COLUMN public.orders.shipped_at IS 'When order was shipped';
COMMENT ON COLUMN public.orders.delivered_at IS 'When order was delivered';

-- =====================================================
-- 7. VERIFICATION QUERY
-- =====================================================

-- Check if all expected columns now exist
SELECT '📊 VERIFICATION: All Expected Columns' as info;
SELECT 
  column_name,
  data_type,
  is_nullable,
  CASE 
    WHEN column_name IN (
      'customer_phone', 'customer_company',
      'billing_address_line1', 'billing_address_line2', 'billing_city', 'billing_state', 'billing_postal_code', 'billing_country',
      'shipping_address_line1', 'shipping_address_line2', 'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country', 'shipping_same_as_billing',
      'payment_method_id', 'payment_method_type', 'payment_confirmed_at', 'payment_failed_at', 'payment_failure_reason',
      'processing_notes', 'estimated_delivery_date', 'tracking_number', 'shipped_at', 'delivered_at'
    ) THEN '✅ EXPECTED'
    ELSE '❌ UNEXPECTED'
  END as status
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
AND column_name IN (
  'customer_phone', 'customer_company',
  'billing_address_line1', 'billing_address_line2', 'billing_city', 'billing_state', 'billing_postal_code', 'billing_country',
  'shipping_address_line1', 'shipping_address_line2', 'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country', 'shipping_same_as_billing',
  'payment_method_id', 'payment_method_type', 'payment_confirmed_at', 'payment_failed_at', 'payment_failure_reason',
  'processing_notes', 'estimated_delivery_date', 'tracking_number', 'shipped_at', 'delivered_at'
)
ORDER BY column_name;

-- =====================================================
-- 8. FINAL STATUS CHECK
-- =====================================================

SELECT '🎯 FINAL STATUS: Orders Table Schema' as info;
SELECT 
  'Total Columns' as metric,
  COUNT(*) as value
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
UNION ALL
SELECT 
  'Expected Columns' as metric,
  COUNT(*) as value
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
AND column_name IN (
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
);

SELECT '✅ Migration Complete! Your orders table now has all the columns the code expects.' as success_message;
