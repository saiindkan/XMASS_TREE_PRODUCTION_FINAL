#!/usr/bin/env node

/**
 * Test script to directly test order creation
 */

const fetch = globalThis.fetch;

const BASE_URL = 'http://localhost:3000';

async function testOrderCreation() {
  console.log('🧪 Testing Order Creation Directly...\n');

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

    // Skip status check to avoid race condition
    console.log('1.5️⃣ Skipping status check to avoid race condition...');

    // Test 2: Process the payment and check response
    console.log('2️⃣ Processing payment...');
    const processResponse = await fetch(`${BASE_URL}/api/stripe-qr-payment/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qrPaymentId: createData.qrPaymentId,
        paymentMethod: 'test_payment'
      })
    });

    const processData = await processResponse.json();
    
    console.log('📋 Payment processing response:', JSON.stringify(processData, null, 2));
    
    if (processData.error) {
      console.error('❌ Payment processing failed:', processData.error);
      return;
    }

    console.log('✅ Payment processed successfully!');
    console.log('   Order ID:', processData.orderId);
    console.log('');

    // Test 3: Wait a moment and check orders
    console.log('3️⃣ Waiting and checking orders...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const debugResponse = await fetch(`${BASE_URL}/api/debug-orders`);
    const debugData = await debugResponse.json();
    
    if (debugData.error) {
      console.error('❌ Debug orders failed:', debugData.error);
      return;
    }

    console.log('✅ Order data retrieved!');
    console.log('   Number of orders:', debugData.orders.length);
    
    // Look for the newest order
    const newestOrder = debugData.orders[0];
    console.log('   Newest order:', newestOrder.order_number);
    console.log('   Created at:', newestOrder.created_at);
    console.log('   Items count:', newestOrder.items ? newestOrder.items.length : 'null');
    
    if (newestOrder.items && newestOrder.items.length > 0) {
      console.log('✅ Items found in newest order!');
      newestOrder.items.forEach((item, index) => {
        console.log(`   Item ${index + 1}:`, item.name, `(${item.quantity}x) - $${item.price}`);
      });
    } else {
      console.log('❌ No items found in newest order');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOrderCreation();
