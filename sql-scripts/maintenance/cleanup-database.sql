-- Clean Up Database and Create Clean Structure
-- This script removes unused tables and creates a clean payment system

-- 1. Drop unused tables (adjust based on what you want to keep)
-- Keep only: users, orders (basic structure), password_resets
-- Remove: customer_addresses, payment_transactions, order_items (if not needed)

-- Drop customer_addresses table (if exists)
DROP TABLE IF EXISTS customer_addresses CASCADE;

-- Drop payment_transactions table (if exists) 
DROP TABLE IF EXISTS payment_transactions CASCADE;

-- Drop order_items table (if exists)
DROP TABLE IF EXISTS order_items CASCADE;

-- 2. Clean up orders table - remove complex fields, keep it simple
ALTER TABLE orders DROP COLUMN IF EXISTS customer_first_name;
ALTER TABLE orders DROP COLUMN IF EXISTS customer_last_name;
ALTER TABLE orders DROP COLUMN IF EXISTS customer_email;
ALTER TABLE orders DROP COLUMN IF EXISTS customer_phone;
ALTER TABLE orders DROP COLUMN IF EXISTS customer_company;
ALTER TABLE orders DROP COLUMN IF EXISTS billing_address_line1;
ALTER TABLE orders DROP COLUMN IF EXISTS billing_address_line2;
ALTER TABLE orders DROP COLUMN IF EXISTS billing_city;
ALTER TABLE orders DROP COLUMN IF EXISTS billing_state;
ALTER TABLE orders DROP COLUMN IF EXISTS billing_postal_code;
ALTER TABLE orders DROP COLUMN IF EXISTS billing_country;
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address_line1;
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address_line2;
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_city;
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_state;
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_postal_code;
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_country;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_method_id;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_method_type;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_intent_id;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_confirmed_at;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_failed_at;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_failure_reason;
ALTER TABLE orders DROP COLUMN IF EXISTS order_status;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_status;
ALTER TABLE orders DROP COLUMN IF EXISTS processing_notes;
ALTER TABLE orders DROP COLUMN IF EXISTS estimated_delivery_date;
ALTER TABLE orders DROP COLUMN IF EXISTS tracking_number;
ALTER TABLE orders DROP COLUMN IF EXISTS shipped_at;
ALTER TABLE orders DROP COLUMN IF EXISTS delivered_at;
ALTER TABLE orders DROP COLUMN IF EXISTS stripe_payment_intent_id;

-- 3. Keep orders table simple with basic fields
-- Verify the basic structure remains
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 4. Create clean, simple tables for the new system

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_addresses table (clean version)
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    address_type TEXT NOT NULL CHECK (address_type IN ('billing', 'shipping')),
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'US',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_transactions table (clean version)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL, -- Amount in cents
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
    payment_method_id TEXT,
    payment_method_type TEXT,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_type ON customer_addresses(address_type);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_stripe_id ON payment_transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);

-- 6. Enable RLS on new tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies
-- Customers: Users can only see their own customer data
CREATE POLICY "Users can view own customer data" ON customers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own customer data" ON customers
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own customer data" ON customers
    FOR UPDATE USING (user_id = auth.uid());

-- Customer addresses: Users can only see addresses for their customer profiles
CREATE POLICY "Users can view own addresses" ON customer_addresses
    FOR SELECT USING (
        customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can insert own addresses" ON customer_addresses
    FOR INSERT WITH CHECK (
        customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can update own addresses" ON customer_addresses
    FOR UPDATE USING (
        customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
    );

-- Payment transactions: Users can only see transactions for their orders
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
    FOR SELECT USING (
        order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
    );

-- Allow webhook updates to payment transactions
CREATE POLICY "Allow webhook updates to payment transactions" ON payment_transactions
    FOR UPDATE TO public USING (true) WITH CHECK (true);

-- 8. Verify the new structure
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 9. Show the new table structures
\d customers
\d customer_addresses  
\d payment_transactions
