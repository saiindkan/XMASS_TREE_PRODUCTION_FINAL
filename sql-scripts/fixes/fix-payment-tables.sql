-- Fix Payment Tables Migration
-- This migration ensures all payment-related tables exist and have the correct structure

-- 1. CREATE PAYMENTS TABLE (missing from current schema)
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'stripe',
  payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. FIX ORDERS TABLE COLUMN MISMATCHES
-- Add missing columns that the APIs expect
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS billing_address JSONB,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax DECIMAL(10, 2) DEFAULT 0;

-- 3. SAFELY MIGRATE EXISTING DATA (only if customer_info column exists)
DO $$
BEGIN
  -- Check if customer_info column exists before trying to migrate data
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' 
    AND column_name = 'customer_info' 
    AND table_schema = 'public'
  ) THEN
    -- Migrate existing data from customer_info to individual columns
    UPDATE orders 
    SET 
      customer_email = customer_info->>'email',
      customer_name = customer_info->>'name',
      customer_phone = customer_info->>'phone',
      billing_address = customer_info->>'billing_address'
    WHERE customer_info IS NOT NULL 
      AND (customer_email IS NULL OR customer_name IS NULL OR customer_phone IS NULL);
    
    RAISE NOTICE 'Migrated data from customer_info column to individual columns';
  ELSE
    RAISE NOTICE 'customer_info column does not exist, skipping data migration';
  END IF;
END $$;

-- 4. ENABLE ROW LEVEL SECURITY ON PAYMENTS TABLE
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 5. CREATE POLICIES FOR PAYMENTS TABLE
DROP POLICY IF EXISTS "payments_select_own" ON payments;
CREATE POLICY "payments_select_own" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "payments_insert_own" ON payments;
CREATE POLICY "payments_insert_own" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- 6. CREATE INDEXES FOR BETTER PERFORMANCE
CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments(order_id);
CREATE INDEX IF NOT EXISTS payments_transaction_id_idx ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS payments_payment_status_idx ON payments(payment_status);
CREATE INDEX IF NOT EXISTS payments_payment_date_idx ON payments(payment_date);

-- Add indexes for new orders columns
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_payment_intent_id_idx ON orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON orders(payment_status);

-- 7. CREATE TRIGGER TO UPDATE UPDATED_AT COLUMN
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at 
  BEFORE UPDATE ON payments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_payments_updated_at();

-- 8. GRANT PERMISSIONS
GRANT ALL ON payments TO postgres, anon, authenticated, service_role;

-- 9. VERIFY EXISTING TABLES HAVE CORRECT STRUCTURE
-- Check if payment_transactions table exists and has correct structure
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_transactions') THEN
    -- Add any missing columns to payment_transactions if needed
    ALTER TABLE payment_transactions 
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'stripe',
    ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- 10. CREATE HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION get_order_payments(order_uuid UUID)
RETURNS TABLE(
  payment_id UUID,
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  payment_status VARCHAR(20),
  transaction_id VARCHAR(255),
  payment_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.amount,
    p.payment_method,
    p.payment_status,
    p.transaction_id,
    p.payment_date
  FROM payments p
  WHERE p.order_id = order_uuid
  ORDER BY p.payment_date DESC;
END;
$$ LANGUAGE plpgsql;

-- 11. CREATE FUNCTION TO GET ORDER SUMMARY WITH PAYMENT INFO
CREATE OR REPLACE FUNCTION get_order_summary_with_payments(order_uuid UUID)
RETURNS TABLE(
  order_id UUID,
  user_id UUID,
  status TEXT,
  total DECIMAL(10,2),
  customer_email TEXT,
  customer_name TEXT,
  payment_status TEXT,
  payment_intent_id TEXT,
  payment_count BIGINT,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.user_id,
    o.status,
    o.total,
    o.customer_email,
    o.customer_name,
    o.payment_status,
    o.payment_intent_id,
    COUNT(p.id)::BIGINT as payment_count,
    MAX(p.payment_date) as last_payment_date,
    o.created_at
  FROM orders o
  LEFT JOIN payments p ON o.id = p.order_id
  WHERE o.id = order_uuid
  GROUP BY o.id, o.user_id, o.status, o.total, o.customer_email, o.customer_name, o.payment_status, o.payment_intent_id, o.created_at;
END;
$$ LANGUAGE plpgsql;

-- 12. VERIFICATION QUERIES
-- These will help verify the migration worked correctly
SELECT 'payments table exists' as check_result WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments')
UNION ALL
SELECT 'orders table has payment_intent_id' as check_result WHERE EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_intent_id')
UNION ALL
SELECT 'orders table has payment_status' as check_result WHERE EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_status')
UNION ALL
SELECT 'orders table has customer_email' as check_result WHERE EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_email')
UNION ALL
SELECT 'orders table has customer_name' as check_result WHERE EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_name')
UNION ALL
SELECT 'orders table has billing_address' as check_result WHERE EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_address')
UNION ALL
SELECT 'payments table has RLS enabled' as check_result WHERE EXISTS (SELECT FROM pg_policies WHERE tablename = 'payments');
