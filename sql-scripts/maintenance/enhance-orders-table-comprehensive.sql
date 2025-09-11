-- Comprehensive Orders Table Enhancement
-- Store all customer details, payment details, and address info in one table

-- 1. Add comprehensive customer and payment fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_first_name TEXT,
ADD COLUMN IF NOT EXISTS customer_last_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS customer_company TEXT,

-- Billing Address Fields
ADD COLUMN IF NOT EXISTS billing_address_line1 TEXT,
ADD COLUMN IF NOT EXISTS billing_address_line2 TEXT,
ADD COLUMN IF NOT EXISTS billing_city TEXT,
ADD COLUMN IF NOT EXISTS billing_state TEXT,
ADD COLUMN IF NOT EXISTS billing_postal_code TEXT,
ADD COLUMN IF NOT EXISTS billing_country TEXT DEFAULT 'US',

-- Shipping Address Fields (if different from billing)
ADD COLUMN IF NOT EXISTS shipping_address_line1 TEXT,
ADD COLUMN IF NOT EXISTS shipping_address_line2 TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_state TEXT,
ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT,
ADD COLUMN IF NOT EXISTS shipping_country TEXT DEFAULT 'US',
ADD COLUMN IF NOT EXISTS shipping_same_as_billing BOOLEAN DEFAULT TRUE,

-- Payment Details
ADD COLUMN IF NOT EXISTS payment_method_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method_type TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_failed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_failure_reason TEXT,

-- Order Processing
ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'pending_payment',
ADD COLUMN IF NOT EXISTS processing_notes TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- 2. Add comments for clarity
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

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS orders_order_status_idx ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS orders_payment_intent_id_idx ON public.orders(payment_intent_id);

-- 4. Create a function to update payment status
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

-- 5. Create a function to get complete order details
CREATE OR REPLACE FUNCTION public.get_complete_order_details(p_order_id UUID)
RETURNS TABLE(
  order_id UUID,
  user_id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  billing_address TEXT,
  shipping_address TEXT,
  items JSONB,
  subtotal DECIMAL(10, 2),
  tax_amount DECIMAL(10, 2),
  shipping_amount DECIMAL(10, 2),
  total DECIMAL(10, 2),
  payment_status TEXT,
  order_status TEXT,
  created_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.user_id,
    CONCAT(o.customer_first_name, ' ', o.customer_last_name) as customer_name,
    o.customer_email,
    o.customer_phone,
    CONCAT(
      o.billing_address_line1, ', ',
      COALESCE(o.billing_address_line2, ''), ', ',
      o.billing_city, ', ',
      o.billing_state, ' ',
      o.billing_postal_code, ', ',
      o.billing_country
    ) as billing_address,
    CASE 
      WHEN o.shipping_same_as_billing THEN 
        CONCAT(
          o.billing_address_line1, ', ',
          COALESCE(o.billing_address_line2, ''), ', ',
          o.billing_city, ', ',
          o.billing_state, ' ',
          o.billing_postal_code, ', ',
          o.billing_country
        )
      ELSE
        CONCAT(
          o.shipping_address_line1, ', ',
          COALESCE(o.shipping_address_line2, ''), ', ',
          o.shipping_city, ', ',
          o.shipping_state, ' ',
          o.shipping_postal_code, ', ',
          o.shipping_country
        )
    END as shipping_address,
    o.items,
    o.subtotal,
    o.tax_amount,
    o.shipping_amount,
    o.total,
    o.payment_status,
    o.order_status,
    o.created_at,
    o.payment_confirmed_at as paid_at
  FROM public.orders o
  WHERE o.id = p_order_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Show the enhanced table structure
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
