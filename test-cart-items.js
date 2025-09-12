#!/usr/bin/env node

/**
 * Test script to check cart items in checkout
 */

const fetch = globalThis.fetch;

const BASE_URL = 'http://localhost:3000';

async function testCartItems() {
  console.log('🧪 Testing Cart Items in Checkout...\n');

  try {
    // Test 1: Check if we can access the checkout page
    console.log('1️⃣ Checking checkout page...');
    const checkoutResponse = await fetch(`${BASE_URL}/checkout`);
    
    if (checkoutResponse.ok) {
      console.log('✅ Checkout page is accessible');
    } else {
      console.log('❌ Checkout page not accessible:', checkoutResponse.status);
    }

    // Test 2: Create a QR payment with items and check what gets stored
    console.log('\n2️⃣ Creating QR Payment with detailed items...');
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
            },
            {
              id: 1,
              name: 'King Fraser Fir',
              price: 170.00,
              quantity: 2,
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

    // Test 3: Process the payment
    console.log('3️⃣ Processing payment...');
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
    
    if (processData.error) {
      console.error('❌ Payment processing failed:', processData.error);
      return;
    }

    console.log('✅ Payment processed successfully!');
    console.log('');

    // Test 4: Check the order in database
    console.log('4️⃣ Checking orders in database...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug-orders`);
    const debugData = await debugResponse.json();
    
    if (debugData.error) {
      console.error('❌ Debug orders failed:', debugData.error);
      return;
    }

    console.log('✅ Order data retrieved!');
    console.log('   Number of orders:', debugData.orders.length);
    
    debugData.orders.forEach((order, index) => {
      console.log(`\n   Order ${index + 1}:`);
      console.log('     Order number:', order.order_number);
      console.log('     Order total:', order.total);
      console.log('     Items count:', order.items ? order.items.length : 'null');
      console.log('     Created at:', order.created_at);
      
      if (order.items && order.items.length > 0) {
        console.log('     ✅ Items found:');
        order.items.forEach((item, itemIndex) => {
          console.log(`       Item ${itemIndex + 1}:`, item.name, `(${item.quantity}x) - $${item.price}`);
        });
      } else {
        console.log('     ❌ No items found');
      }
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCartItems();
