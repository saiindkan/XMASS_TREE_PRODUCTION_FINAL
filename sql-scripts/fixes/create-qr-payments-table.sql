-- Create QR payments table for QR code payment functionality
-- This table stores QR payment sessions and their status

-- Drop table if exists to ensure clean creation
DROP TABLE IF EXISTS public.qr_payments CASCADE;

CREATE TABLE public.qr_payments (
  id TEXT PRIMARY KEY,
  amount INTEGER NOT NULL CHECK (amount > 0), -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
  customer_info JSONB NOT NULL, -- Store customer information
  payment_method TEXT, -- Payment method used (e.g., 'apple_pay', 'google_pay', 'paypal')
  transaction_id TEXT, -- External transaction ID
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.qr_payments ENABLE ROW LEVEL SECURITY;

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

-- Create a function to clean up expired QR payments
CREATE OR REPLACE FUNCTION public.cleanup_expired_qr_payments()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE public.qr_payments 
  SET status = 'expired'
  WHERE status = 'pending' 
    AND expires_at < NOW();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get QR payment status
CREATE OR REPLACE FUNCTION public.get_qr_payment_status(qr_id TEXT)
RETURNS TABLE (
  id TEXT,
  status TEXT,
  amount INTEGER,
  currency TEXT,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    qp.id,
    qp.status,
    qp.amount,
    qp.currency,
    qp.created_at,
    qp.expires_at,
    qp.completed_at
  FROM public.qr_payments qp
  WHERE qp.id = qr_id;
END;
$$ LANGUAGE plpgsql;

-- Verify table creation
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'qr_payments';

SELECT 'QR payments table created successfully' as status;
