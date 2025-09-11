-- Enhance the existing orders table for better Stripe integration
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS shipping_address_id UUID REFERENCES public.customer_addresses(id),
ADD COLUMN IF NOT EXISTS billing_address_id UUID REFERENCES public.customer_addresses(id),
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'usd',
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update the existing total column to be calculated from subtotal + tax + shipping - discount
ALTER TABLE public.orders 
ALTER COLUMN total SET DEFAULT 0;

-- Create a function to calculate order total
CREATE OR REPLACE FUNCTION public.calculate_order_total_amount(order_uuid UUID)
RETURNS DECIMAL(10, 2) AS $$
BEGIN
  RETURN (
    SELECT COALESCE(subtotal, 0) + COALESCE(tax_amount, 0) + COALESCE(shipping_amount, 0) - COALESCE(discount_amount, 0)
    FROM public.orders 
    WHERE id = order_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the total when order details change
CREATE OR REPLACE FUNCTION public.update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total = public.calculate_order_total_amount(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS trigger_update_order_total ON public.orders;
CREATE TRIGGER trigger_update_order_total
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_order_total();

-- Add additional indexes for better performance
CREATE INDEX IF NOT EXISTS orders_stripe_payment_intent_id_idx ON public.orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS orders_paid_at_idx ON public.orders(paid_at);

-- Create a function to get order summary
CREATE OR REPLACE FUNCTION public.get_order_summary(order_uuid UUID)
RETURNS TABLE(
  order_id UUID,
  user_id UUID,
  status TEXT,
  subtotal DECIMAL(10, 2),
  tax_amount DECIMAL(10, 2),
  shipping_amount DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2),
  total DECIMAL(10, 2),
  item_count BIGINT,
  created_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.user_id,
    o.status,
    o.subtotal,
    o.tax_amount,
    o.shipping_amount,
    o.discount_amount,
    o.total,
    COUNT(oi.id)::BIGINT as item_count,
    o.created_at,
    o.paid_at
  FROM public.orders o
  LEFT JOIN public.order_items oi ON o.id = oi.order_id
  WHERE o.id = order_uuid
  GROUP BY o.id, o.user_id, o.status, o.subtotal, o.tax_amount, o.shipping_amount, o.discount_amount, o.total, o.created_at, o.paid_at;
END;
$$ LANGUAGE plpgsql;
