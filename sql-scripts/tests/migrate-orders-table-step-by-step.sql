-- Step-by-step migration to enhance orders table
-- Run this in your Supabase SQL Editor to safely add new fields

-- STEP 1: Check current table structure
SELECT '📋 Current orders table structure:' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- STEP 2: Add new customer detail fields (nullable first)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_first_name TEXT,
ADD COLUMN IF NOT EXISTS customer_last_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS customer_company TEXT;

-- STEP 3: Add new billing address fields
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS billing_address_line1 TEXT,
ADD COLUMN IF NOT EXISTS billing_address_line2 TEXT,
ADD COLUMN IF NOT EXISTS billing_city TEXT,
ADD COLUMN IF NOT EXISTS billing_state TEXT,
ADD COLUMN IF NOT EXISTS billing_postal_code TEXT,
ADD COLUMN IF NOT EXISTS billing_country TEXT DEFAULT 'US';

-- STEP 4: Add new shipping address fields
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_address_line1 TEXT,
ADD COLUMN IF NOT EXISTS shipping_address_line2 TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_state TEXT,
ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT,
ADD COLUMN IF NOT EXISTS shipping_country TEXT DEFAULT 'US',
ADD COLUMN IF NOT EXISTS shipping_same_as_billing BOOLEAN DEFAULT TRUE;

-- STEP 5: Add new payment detail fields
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_method_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method_type TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_failed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_failure_reason TEXT;

-- STEP 6: Add new order processing fields
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_status TEXT,
ADD COLUMN IF NOT EXISTS processing_notes TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- STEP 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS orders_order_status_idx ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS orders_payment_intent_id_idx ON public.orders(payment_intent_id);

-- STEP 8: Add comments for clarity
COMMENT ON COLUMN public.orders.customer_first_name IS 'Customer first name';
COMMENT ON COLUMN public.orders.customer_last_name IS 'Customer last name';
COMMENT ON COLUMN public.orders.customer_email IS 'Customer email address';
COMMENT ON COLUMN public.orders.customer_phone IS 'Customer phone number';
COMMENT ON COLUMN public.orders.customer_company IS 'Customer company name';

COMMENT ON COLUMN public.orders.billing_address_line1 IS 'Billing address line 1';
COMMENT ON COLUMN public.orders.billing_address_line2 IS 'Billing address line 2';
COMMENT ON COLUMN public.orders.billing_city IS 'Billing city';
COMMENT ON COLUMN public.orders.billing_state IS 'Billing state/province';
COMMENT ON COLUMN public.orders.billing_postal_code IS 'Billing postal/zip code';
COMMENT ON COLUMN public.orders.billing_country IS 'Billing country';

COMMENT ON COLUMN public.orders.shipping_address_line1 IS 'Shipping address line 1';
COMMENT ON COLUMN public.orders.shipping_address_line2 IS 'Shipping address line 2';
COMMENT ON COLUMN public.orders.shipping_city IS 'Shipping city';
COMMENT ON COLUMN public.orders.shipping_state IS 'Shipping state/province';
COMMENT ON COLUMN public.orders.shipping_postal_code IS 'Shipping postal/zip code';
COMMENT ON COLUMN public.orders.shipping_country IS 'Shipping country';
COMMENT ON COLUMN public.orders.shipping_same_as_billing IS 'Whether shipping address is same as billing';

COMMENT ON COLUMN public.orders.payment_method_id IS 'Stripe payment method ID';
COMMENT ON COLUMN public.orders.payment_method_type IS 'Type of payment method (card, etc.)';
COMMENT ON COLUMN public.orders.payment_status IS 'Payment status (pending, succeeded, failed)';
COMMENT ON COLUMN public.orders.payment_intent_id IS 'Stripe payment intent ID';
COMMENT ON COLUMN public.orders.payment_confirmed_at IS 'When payment was confirmed';
COMMENT ON COLUMN public.orders.payment_failed_at IS 'When payment failed';
COMMENT ON COLUMN public.orders.payment_failure_reason IS 'Reason for payment failure';

COMMENT ON COLUMN public.orders.order_status IS 'Overall order status';
COMMENT ON COLUMN public.orders.processing_notes IS 'Internal processing notes';
COMMENT ON COLUMN public.orders.estimated_delivery_date IS 'Estimated delivery date';
COMMENT ON COLUMN public.orders.tracking_number IS 'Shipping tracking number';
COMMENT ON COLUMN public.orders.shipped_at IS 'When order was shipped';
COMMENT ON COLUMN public.orders.delivered_at IS 'When order was delivered';

-- STEP 9: Create helper functions
CREATE OR REPLACE FUNCTION public.update_order_payment_status(
  p_order_id UUID,
  p_payment_status TEXT,
  p_payment_intent_id TEXT DEFAULT NULL,
  p_payment_method_id TEXT DEFAULT NULL,
  p_payment_method_type TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_success BOOLEAN := FALSE;
BEGIN
  UPDATE public.orders 
  SET 
    payment_status = p_payment_status,
    payment_intent_id = COALESCE(p_payment_intent_id, payment_intent_id),
    payment_method_id = COALESCE(p_payment_method_id, payment_method_id),
    payment_method_type = COALESCE(p_payment_method_type, payment_method_type),
    payment_confirmed_at = CASE WHEN p_payment_status = 'succeeded' THEN NOW() ELSE payment_confirmed_at END,
    payment_failed_at = CASE WHEN p_payment_status = 'failed' THEN NOW() ELSE payment_failed_at END,
    order_status = CASE 
      WHEN p_payment_status = 'succeeded' THEN 'paid'
      WHEN p_payment_status = 'failed' THEN 'payment_failed'
      ELSE order_status
    END,
    updated_at = NOW()
  WHERE id = p_order_id;
  
  GET DIAGNOSTICS v_success = ROW_COUNT;
  RETURN v_success > 0;
END;
$$ LANGUAGE plpgsql;

-- STEP 10: Show the enhanced table structure
SELECT '✅ Orders table enhanced successfully!' as status;

SELECT 'Enhanced orders table structure:' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- STEP 11: Test the new function
SELECT '🧪 Testing payment status update function:' as info;
SELECT 
  'Function exists' as status,
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name = 'update_order_payment_status'
AND routine_schema = 'public';

SELECT '🎉 Migration completed successfully! Your orders table now supports comprehensive data storage.' as final_status;
