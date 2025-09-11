-- =====================================================
-- ADD MISSING FIELDS TO ORDERS TABLE
-- Add subtotal, tax_amount, shipping_amount, discount_amount, currency, notes
-- =====================================================

-- Add missing fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd',
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing orders to have default values
UPDATE public.orders 
SET 
  subtotal = total,
  tax_amount = 0,
  shipping_amount = 0,
  discount_amount = 0,
  currency = 'usd'
WHERE subtotal IS NULL;

-- Add constraints to ensure positive values
ALTER TABLE public.orders 
ADD CONSTRAINT orders_subtotal_positive CHECK (subtotal >= 0),
ADD CONSTRAINT orders_tax_amount_positive CHECK (tax_amount >= 0),
ADD CONSTRAINT orders_shipping_amount_positive CHECK (shipping_amount >= 0),
ADD CONSTRAINT orders_discount_amount_positive CHECK (discount_amount >= 0);

-- Add index for currency lookups
CREATE INDEX IF NOT EXISTS orders_currency_idx ON public.orders(currency);

-- Verify the changes
SELECT '=== VERIFYING NEW FIELDS ===' as info;

SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders'
ORDER BY ordinal_position;

SELECT '=== MIGRATION COMPLETE ===' as info;
SELECT '✅ All missing fields added to orders table' as status;
SELECT '🎯 Your API can now use subtotal, tax_amount, shipping_amount, discount_amount, currency, notes' as next_step;
