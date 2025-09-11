-- =====================================================
-- ADD MISSING FIELDS TO ORDERS TABLE (SIMPLIFIED)
-- Only adds fields that don't exist, skips existing constraints
-- =====================================================

-- Add missing fields to orders table (only if they don't exist)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd',
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing orders to have default values (only if needed)
UPDATE public.orders 
SET 
  subtotal = total,
  tax_amount = 0,
  shipping_amount = 0,
  discount_amount = 0,
  currency = 'usd'
WHERE subtotal IS NULL;

-- Add constraints only if they don't exist (using IF NOT EXISTS)
DO $$
BEGIN
    -- Check if constraint exists before adding
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'orders_subtotal_positive'
    ) THEN
        ALTER TABLE public.orders ADD CONSTRAINT orders_subtotal_positive CHECK (subtotal >= 0);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'orders_tax_amount_positive'
    ) THEN
        ALTER TABLE public.orders ADD CONSTRAINT orders_tax_amount_positive CHECK (tax_amount >= 0);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'orders_shipping_amount_positive'
    ) THEN
        ALTER TABLE public.orders ADD CONSTRAINT orders_shipping_amount_positive CHECK (shipping_amount >= 0);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'orders_discount_amount_positive'
    ) THEN
        ALTER TABLE public.orders ADD CONSTRAINT orders_discount_amount_positive CHECK (discount_amount >= 0);
    END IF;
END $$;

-- Add index for currency lookups (only if it doesn't exist)
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

-- Check existing constraints
SELECT '=== CHECKING EXISTING CONSTRAINTS ===' as info;

SELECT 
  conname as constraint_name,
  contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'public.orders'::regclass
ORDER BY conname;

SELECT '=== SIMPLIFIED MIGRATION COMPLETE ===' as info;
SELECT '✅ All missing fields added to orders table' as status;
SELECT '🎯 Your API can now use all required fields' as next_step;
SELECT '🚀 Run the emergency bypass script next!' as action;
