-- Create customer_addresses table for shipping and billing information
CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  address_type TEXT NOT NULL CHECK (address_type IN ('shipping', 'billing')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  email TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies for customer_addresses
CREATE POLICY "Users can view their own addresses"
  ON public.customer_addresses
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = customer_addresses.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create addresses"
  ON public.customer_addresses
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = customer_addresses.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own addresses"
  ON public.customer_addresses
  FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = customer_addresses.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS customer_addresses_user_id_idx ON public.customer_addresses(user_id);
CREATE INDEX IF NOT EXISTS customer_addresses_order_id_idx ON public.customer_addresses(order_id);
CREATE INDEX IF NOT EXISTS customer_addresses_address_type_idx ON public.customer_addresses(address_type);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_customer_addresses_updated_at
BEFORE UPDATE ON public.customer_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function to get default address for a user
CREATE OR REPLACE FUNCTION public.get_default_address(user_uuid UUID, addr_type TEXT)
RETURNS public.customer_addresses AS $$
BEGIN
  RETURN (
    SELECT * FROM public.customer_addresses 
    WHERE user_id = user_uuid 
    AND address_type = addr_type 
    AND is_default = TRUE 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql;
