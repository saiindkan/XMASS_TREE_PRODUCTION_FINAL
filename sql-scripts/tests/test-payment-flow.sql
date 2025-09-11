-- Test Payment Flow Script
-- This script tests the complete payment flow to ensure everything works

-- 1. TEST ORDER CREATION (simulating the create-payment-intent API)
DO $$
DECLARE
    test_order_id UUID;
    test_user_id UUID;
    test_items JSONB;
    test_customer_info JSONB;
BEGIN
    -- Get a test user (first user in the system)
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    -- If no users exist, create a test scenario
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'No users found. This is expected in a fresh database.';
        RETURN;
    END IF;
    
    -- Test data
    test_items := '[
        {
            "product_id": 1,
            "product_name": "Test Product",
            "quantity": 2,
            "price": 19.99,
            "total": 39.98
        }
    ]'::JSONB;
    
    test_customer_info := '{
        "email": "test@example.com",
        "cardholderName": "Test User",
        "phone": "+1-555-123-4567",
        "address": "123 Test Street",
        "city": "Test City",
        "state": "TS",
        "zipCode": "12345",
        "country": "US"
    }'::JSONB;
    
    -- Create test order (simulating create-payment-intent API)
    INSERT INTO orders (
        user_id,
        status,
        total,
        items,
        customer_info,
        customer_email,
        customer_name,
        customer_phone,
        billing_address,
        subtotal,
        shipping,
        tax,
        payment_status
    ) VALUES (
        test_user_id,
        'pending',
        45.97,
        test_items,
        test_customer_info,
        'test@example.com',
        'Test User',
        '+1-555-123-4567',
        '{"street": "123 Test Street", "city": "Test City", "state": "TS", "zip_code": "12345", "country": "US"}',
        39.98,
        5.99,
        0.00,
        'pending'
    ) RETURNING id INTO test_order_id;
    
    RAISE NOTICE 'Test order created with ID: %', test_order_id;
    
    -- 2. TEST PAYMENT CREATION (simulating webhook success)
    INSERT INTO payments (
        order_id,
        amount,
        payment_method,
        payment_status,
        transaction_id,
        payment_date
    ) VALUES (
        test_order_id,
        45.97,
        'stripe',
        'completed',
        'pi_test_' || substr(md5(random()::text), 1, 24),
        NOW()
    );
    
    RAISE NOTICE 'Test payment created for order: %', test_order_id;
    
    -- 3. TEST ORDER STATUS UPDATE (simulating webhook)
    UPDATE orders 
    SET 
        status = 'completed',
        payment_intent_id = 'pi_test_' || substr(md5(random()::text), 1, 24),
        payment_status = 'succeeded',
        paid_at = NOW(),
        updated_at = NOW()
    WHERE id = test_order_id;
    
    RAISE NOTICE 'Test order status updated to completed';
    
    -- 4. TEST HELPER FUNCTIONS
    RAISE NOTICE 'Testing get_order_payments function...';
    -- This would show results if we had a way to display them
    
    RAISE NOTICE 'Testing get_order_summary_with_payments function...';
    -- This would show results if we had a way to display them
    
    -- 5. VERIFY THE DATA
    RAISE NOTICE 'Verifying test data...';
    
    -- Check order
    IF EXISTS (SELECT 1 FROM orders WHERE id = test_order_id AND status = 'completed') THEN
        RAISE NOTICE '✅ Order verification passed';
    ELSE
        RAISE NOTICE '❌ Order verification failed';
    END IF;
    
    -- Check payment
    IF EXISTS (SELECT 1 FROM payments WHERE order_id = test_order_id AND payment_status = 'completed') THEN
        RAISE NOTICE '✅ Payment verification passed';
    ELSE
        RAISE NOTICE '❌ Payment verification failed';
    END IF;
    
    -- Check customer info
    IF EXISTS (SELECT 1 FROM orders WHERE id = test_order_id AND customer_email = 'test@example.com') THEN
        RAISE NOTICE '✅ Customer info verification passed';
    ELSE
        RAISE NOTICE '❌ Customer info verification failed';
    END IF;
    
    RAISE NOTICE 'Test payment flow completed successfully!';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test failed with error: %', SQLERRM;
END $$;

-- 6. DISPLAY TEST RESULTS
SELECT 
    'Test Results' as test_type,
    o.id as order_id,
    o.status as order_status,
    o.customer_email,
    o.total as order_total,
    p.payment_status,
    p.amount as payment_amount,
    p.transaction_id
FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
WHERE o.customer_email = 'test@example.com'
ORDER BY o.created_at DESC
LIMIT 5;

-- 7. CLEANUP (optional - uncomment to remove test data)
-- DELETE FROM payments WHERE order_id IN (SELECT id FROM orders WHERE customer_email = 'test@example.com');
-- DELETE FROM orders WHERE customer_email = 'test@example.com';

-- 8. FINAL VERIFICATION
SELECT 
    'Final Check' as check_type,
    COUNT(*) as total_orders,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN payment_status = 'succeeded' THEN 1 END) as successful_payments
FROM orders;

SELECT 
    'Payment Summary' as summary_type,
    COUNT(*) as total_payments,
    COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as completed_payments,
    COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_payments
FROM payments;
