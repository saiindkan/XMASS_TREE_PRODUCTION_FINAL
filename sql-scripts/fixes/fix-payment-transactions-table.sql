-- Fix missing payment_transactions table
-- This script creates the payment_transactions table if it doesn't exist

-- Check if payment_transactions table exists
SELECT '📋 Checking payment_transactions table:' as info;
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'payment_transactions';

-- Create payment_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE,
    qr_payment_id TEXT, -- For QR payments
    amount INTEGER NOT NULL CHECK (amount > 0), -- Amount in cents
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled', 'requires_payment_method', 'requires_confirmation', 'requires_action', 'processing')),
    payment_method_id TEXT,
    payment_method_type TEXT,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS payment_transactions_order_id_idx ON public.payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS payment_transactions_status_idx ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS payment_transactions_created_at_idx ON public.payment_transactions(created_at);

-- Enable Row Level Security
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_transactions table
DROP POLICY IF EXISTS "Users can view their own payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Service role can manage payment transactions" ON public.payment_transactions;

CREATE POLICY "Users can view their own payment transactions"
  ON public.payment_transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = payment_transactions.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage payment transactions"
  ON public.payment_transactions
  FOR ALL
  USING (true);

-- Grant permissions
GRANT ALL ON public.payment_transactions TO service_role;
GRANT ALL ON public.payment_transactions TO postgres;
GRANT SELECT, INSERT, UPDATE ON public.payment_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.payment_transactions TO anon;

-- Verify the table was created
SELECT '📋 Payment transactions table structure:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'payment_transactions'
ORDER BY ordinal_position;

SELECT 'Payment transactions table created successfully' as status;
