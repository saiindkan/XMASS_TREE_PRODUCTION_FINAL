-- Add test products to the database
-- This script creates sample Christmas tree products for testing

-- First, check if products table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'products';

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Products are viewable by everyone"
  ON public.products
  FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Service role can manage products"
  ON public.products
  FOR ALL
  USING (true);

-- Grant permissions
GRANT ALL ON public.products TO service_role;
GRANT ALL ON public.products TO postgres;
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.products TO anon;

-- Insert test products
INSERT INTO public.products (name, description, price, image_url, category, stock_quantity) VALUES
('Test Product - $1.00', 'A simple test product for $1.00 to verify payment processing and order functionality.', 1.00, '/1.jpg', 'Test Products', 100),
('Premium Fraser Fir', 'Beautiful 7-8 ft Fraser Fir Christmas tree with excellent needle retention and classic Christmas tree shape.', 89.99, '/1.jpg', 'Christmas Trees', 25),
('Noble Fir Deluxe', '8-9 ft Noble Fir with soft, blue-green needles and strong branches perfect for heavy ornaments.', 129.99, '/2.jpg', 'Christmas Trees', 20),
('Douglas Fir Classic', '6-7 ft Douglas Fir with sweet fragrance and excellent needle retention.', 69.99, '/3.jpg', 'Christmas Trees', 30),
('Blue Spruce Premium', '7-8 ft Blue Spruce with distinctive blue-green color and sturdy branches.', 99.99, '/4.jpg', 'Christmas Trees', 15),
('White Pine Elegant', '8-9 ft White Pine with soft, flexible needles and elegant shape.', 119.99, '/5.jpg', 'Christmas Trees', 18),
('Christmas Tree Stand', 'Heavy-duty metal stand with water reservoir for trees up to 9 feet.', 29.99, '/decor-images/1.jpg', 'Accessories', 50),
('LED String Lights', 'Energy-efficient LED string lights with warm white color, 100 lights per string.', 19.99, '/decor-images/2.jpg', 'Decorations', 100),
('Ornament Set', 'Set of 24 hand-painted glass ornaments in various Christmas themes.', 39.99, '/decor-images/3.jpg', 'Decorations', 75),
('Tree Skirt', 'Red velvet tree skirt with gold trim, 48-inch diameter.', 24.99, '/decor-images/4.jpg', 'Accessories', 40),
('Tree Topper Star', 'Elegant gold star tree topper with LED lights.', 34.99, '/decor-images/5.jpg', 'Decorations', 30)
ON CONFLICT (name) DO NOTHING;

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products table
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Verify products were added
SELECT 
    id,
    name,
    price,
    category,
    stock_quantity,
    is_active
FROM public.products
ORDER BY category, name;

SELECT 'Test products added successfully' as status;
