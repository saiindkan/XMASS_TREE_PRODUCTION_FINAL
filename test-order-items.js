#!/usr/bin/env node

/**
 * Test script to check if order items are being stored correctly
 */

const fetch = globalThis.fetch;

const BASE_URL = 'http://localhost:3000';

async function testOrderItems() {
  console.log('🧪 Testing Order Items Storage...\n');

  try {
    // Test 1: Create QR Payment with items
    console.log('1️⃣ Creating QR Payment with items...');
    const createResponse = await fetch(`${BASE_URL}/api/stripe-qr-payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 1.00,
        currency: 'usd',
        customerInfo: {
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '+1234567890',
          address: {
            line1: '123 Test Street',
            city: 'Test City',
            state: 'TS',
            postal_code: '12345',
            country: 'US'
          },
          items: [
            {
              id: 0,
              name: 'Test Product - $1.00',
              price: 1.00,
              quantity: 1,
              image: '/1.jpg'
            }
          ]
        }
      })
    });

    const createData = await createResponse.json();
    
    if (createData.error) {
      console.error('❌ QR Payment creation failed:', createData.error);
      return;
    }

    console.log('✅ QR Payment created successfully!');
    console.log('   QR Payment ID:', createData.qrPaymentId);
    console.log('');

    // Test 2: Process the payment
    console.log('2️⃣ Processing payment...');
    const processResponse = await fetch(`${BASE_URL}/api/stripe-qr-payment/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qrPaymentId: createData.qrPaymentId,
        paymentMethod: 'test_payment',
        paymentMethodId: 'pm_card_visa',
        mobileAppData: {
          app: 'test_app',
          version: '1.0.0'
        }
      })
    });

    const processData = await processResponse.json();
    
    if (processData.error) {
      console.error('❌ Payment processing failed:', processData.error);
      return;
    }

    console.log('✅ Payment processed successfully!');
    console.log('');

    // Test 3: Check orders
    console.log('3️⃣ Checking orders...');
    const ordersResponse = await fetch(`${BASE_URL}/api/orders`);
    const ordersData = await ordersResponse.json();
    
    if (ordersData.error) {
      console.error('❌ Orders fetch failed:', ordersData.error);
      return;
    }

    console.log('✅ Orders fetched successfully!');
    console.log('   Number of orders:', ordersData.orders.length);
    
    if (ordersData.orders.length > 0) {
      const latestOrder = ordersData.orders[0];
      console.log('   Latest order number:', latestOrder.order_number);
      console.log('   Order status:', latestOrder.status);
      console.log('   Order total:', latestOrder.total);
      console.log('   Order items:', JSON.stringify(latestOrder.order_items, null, 2));
      
      if (latestOrder.order_items && latestOrder.order_items.length > 0) {
        console.log('✅ Order items are being stored correctly!');
        console.log('   Item count:', latestOrder.order_items.length);
        console.log('   First item:', latestOrder.order_items[0]);
      } else {
        console.log('❌ Order items are not being stored correctly');
        console.log('   Order items value:', latestOrder.order_items);
      }
    } else {
      console.log('❌ No orders found');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOrderItems();
