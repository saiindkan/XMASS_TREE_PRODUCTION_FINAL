-- Complete Database Rebuild with Clean Structure
-- This script drops all existing tables and recreates them with minimal, clean columns
-- Run this in Supabase SQL Editor

-- =====================================================
-- STEP 1: Drop all existing tables (clean slate)
-- =====================================================

-- Drop tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS customer_addresses CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop any backup tables
DROP TABLE IF EXISTS payment_transactions_backup CASCADE;
DROP TABLE IF EXISTS customer_addresses_backup CASCADE;
DROP TABLE IF EXISTS customers_backup CASCADE;
DROP TABLE IF EXISTS order_items_backup CASCADE;
DROP TABLE IF EXISTS orders_backup CASCADE;
DROP TABLE IF EXISTS password_resets_backup CASCADE;
DROP TABLE IF EXISTS users_backup CASCADE;

-- =====================================================
-- STEP 2: Create clean, minimal tables
-- =====================================================

-- 1. USERS TABLE (Core user authentication)
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    auth_id TEXT UNIQUE, -- For OAuth providers
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PASSWORD_RESETS TABLE (Password reset functionality)
CREATE TABLE password_resets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMERS TABLE (Customer information)
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Unique constraint to prevent duplicate customer records per user
    UNIQUE(user_id, email)
);

-- 4. CUSTOMER_ADDRESSES TABLE (Billing and shipping addresses)
CREATE TABLE customer_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
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

-- 5. ORDERS TABLE (Order information)
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL, -- Human-readable unique order number
    items JSONB NOT NULL, -- Store items as JSON
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure total calculation is correct
    CONSTRAINT valid_total CHECK (total = subtotal + tax_amount + shipping_amount - discount_amount)
);

-- 6. PAYMENT_TRANSACTIONS TABLE (Payment tracking)
CREATE TABLE payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0), -- Amount in cents
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled', 'requires_payment_method', 'requires_confirmation', 'requires_action', 'processing')),
    payment_method_id TEXT,
    payment_method_type TEXT,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STEP 3: Create indexes for performance
-- =====================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_id);

-- Password resets indexes
CREATE INDEX idx_password_resets_email ON password_resets(email);
CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_expires ON password_resets(expires_at);

-- Customers table indexes
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_name ON customers(last_name, first_name);

-- Customer addresses indexes
CREATE INDEX idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX idx_customer_addresses_type ON customer_addresses(address_type);
CREATE INDEX idx_customer_addresses_default ON customer_addresses(customer_id, address_type, is_default);

-- Orders table indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Payment transactions indexes
CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_stripe_id ON payment_transactions(stripe_payment_intent_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at);

-- =====================================================
-- STEP 4: Enable Row Level Security (RLS)
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 5: Create RLS Policies
-- =====================================================

-- Users: Users can only see their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (id = auth.uid() OR auth_id = auth.uid()::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (id = auth.uid() OR auth_id = auth.uid()::text);

-- Password resets: Allow public access for password reset functionality
CREATE POLICY "Allow password reset access" ON password_resets
    FOR ALL USING (true);

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

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (user_id = auth.uid());

-- Payment transactions: Users can only see transactions for their orders
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
    FOR SELECT USING (
        order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
    );

-- Allow webhook updates to payment transactions (for Stripe webhooks)
CREATE POLICY "Allow webhook updates to payment transactions" ON payment_transactions
    FOR UPDATE TO public USING (true) WITH CHECK (true);

-- =====================================================
-- STEP 6: Create helper functions and constraints
-- =====================================================

-- Add unique constraint for default addresses (one default per type per customer)
ALTER TABLE customer_addresses 
ADD CONSTRAINT unique_default_address 
UNIQUE (customer_id, address_type, is_default);

-- Create function to check unique default addresses
CREATE OR REPLACE FUNCTION check_unique_default_address()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is a default address, ensure no other default exists for same customer and type
    IF NEW.is_default = true THEN
        IF EXISTS (
            SELECT 1 FROM customer_addresses 
            WHERE customer_id = NEW.customer_id 
            AND address_type = NEW.address_type 
            AND is_default = true 
            AND id != NEW.id
        ) THEN
            RAISE EXCEPTION 'Only one default address allowed per customer per address type';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce the constraint
CREATE TRIGGER enforce_unique_default_address
    BEFORE INSERT OR UPDATE ON customer_addresses
    FOR EACH ROW EXECUTE FUNCTION check_unique_default_address();

-- Function to generate unique order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        -- Format: ORD-YYYYMMDD-XXXX (e.g., ORD-20241119-0001)
        new_order_number := 'ORD-' || to_char(NOW(), 'YYYYMMDD') || '-' || lpad(counter::text, 4, '0');
        
        -- Check if this order number already exists
        IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) THEN
            RETURN new_order_number;
        END IF;
        
        counter := counter + 1;
        
        -- Safety check to prevent infinite loop
        IF counter > 9999 THEN
            RAISE EXCEPTION 'Unable to generate unique order number';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 7: Create triggers
-- =====================================================

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at BEFORE UPDATE ON customer_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 8: Verify the new structure
-- =====================================================

-- Show all tables
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Show table structures
\d users
\d password_resets
\d customers
\d customer_addresses
\d orders
\d payment_transactions

-- Show RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Show indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- STEP 9: Test data insertion (optional)
-- =====================================================

-- Uncomment these lines to test the new structure
/*
-- Test user creation
INSERT INTO users (email, name) VALUES ('test@example.com', 'Test User');

-- Test customer creation
INSERT INTO customers (user_id, first_name, last_name, email) 
SELECT id, 'Test', 'Customer', email FROM users WHERE email = 'test@example.com';

-- Test address creation
INSERT INTO customer_addresses (customer_id, address_type, address_line1, city, state, postal_code)
SELECT id, 'billing', '123 Test St', 'Test City', 'TS', '12345' 
FROM customers WHERE email = 'test@example.com';

-- Test order creation
INSERT INTO orders (user_id, customer_id, order_number, items, subtotal, tax_amount, total, status)
SELECT 
    u.id, 
    c.id, 
    generate_order_number(),
    '[{"id": "test", "name": "Test Product", "price": 10.00, "quantity": 1}]',
    10.00,
    0.80,
    10.80,
    'pending_payment'
FROM users u 
JOIN customers c ON u.id = c.user_id 
WHERE u.email = 'test@example.com';

-- Clean up test data
DELETE FROM orders WHERE notes IS NULL;
DELETE FROM customer_addresses WHERE address_line1 = '123 Test St';
DELETE FROM customers WHERE first_name = 'Test';
DELETE FROM users WHERE email = 'test@example.com';
*/
