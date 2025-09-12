-- Fix QR payments table by ensuring all required columns exist
-- This script handles both creating the table and adding missing columns

-- Check if table exists and create if it doesn't
CREATE TABLE IF NOT EXISTS public.qr_payments (
  id TEXT PRIMARY KEY,
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
  customer_info JSONB NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  notes TEXT
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add currency column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'qr_payments' 
        AND column_name = 'currency'
    ) THEN
        ALTER TABLE public.qr_payments ADD COLUMN currency TEXT NOT NULL DEFAULT 'usd';
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'qr_payments' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.qr_payments ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
        ALTER TABLE public.qr_payments ADD CONSTRAINT qr_payments_status_check 
        CHECK (status IN ('pending', 'completed', 'expired', 'cancelled'));
    END IF;

    -- Add customer_info column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'qr_payments' 
        AND column_name = 'customer_info'
    ) THEN
        ALTER TABLE public.qr_payments ADD COLUMN customer_info JSONB NOT NULL DEFAULT '{}';
    END IF;

    -- Add payment_method column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'qr_payments' 
        AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE public.qr_payments ADD COLUMN payment_method TEXT;
    END IF;

    -- Add transaction_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'qr_payments' 
        AND column_name = 'transaction_id'
    ) THEN
        ALTER TABLE public.qr_payments ADD COLUMN transaction_id TEXT;
    END IF;

    -- Add expires_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'qr_payments' 
        AND column_name = 'expires_at'
    ) THEN
        ALTER TABLE public.qr_payments ADD COLUMN expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes');
    END IF;

    -- Add completed_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'qr_payments' 
        AND column_name = 'completed_at'
    ) THEN
        ALTER TABLE public.qr_payments ADD COLUMN completed_at TIMESTAMPTZ;
    END IF;

    -- Add notes column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'qr_payments' 
        AND column_name = 'notes'
    ) THEN
        ALTER TABLE public.qr_payments ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.qr_payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "QR payments are viewable by service role" ON public.qr_payments;
DROP POLICY IF EXISTS "Service role can manage QR payments" ON public.qr_payments;

-- Create policies for qr_payments
CREATE POLICY "QR payments are viewable by service role"
  ON public.qr_payments
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage QR payments"
  ON public.qr_payments
  FOR ALL
  USING (true);

-- Grant permissions
GRANT ALL ON public.qr_payments TO service_role;
GRANT ALL ON public.qr_payments TO postgres;
GRANT ALL ON public.qr_payments TO authenticated;
GRANT ALL ON public.qr_payments TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS qr_payments_status_idx ON public.qr_payments(status);
CREATE INDEX IF NOT EXISTS qr_payments_created_at_idx ON public.qr_payments(created_at);
CREATE INDEX IF NOT EXISTS qr_payments_expires_at_idx ON public.qr_payments(expires_at);

-- Verify table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'qr_payments'
ORDER BY ordinal_position;

SELECT 'QR payments table fixed successfully' as status;
