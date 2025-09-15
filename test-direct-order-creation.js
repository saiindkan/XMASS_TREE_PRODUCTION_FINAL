#!/usr/bin/env node

/**
 * Test script to directly test order creation without status checks
 */

const fetch = globalThis.fetch;

const BASE_URL = 'http://localhost:3000';

async function testDirectOrderCreation() {
  console.log('🧪 Testing Direct Order Creation...\n');

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

    // Test 2: Directly call the order creation process
    console.log('2️⃣ Directly calling order creation process...');
    
    // Import the QR payment handler and call it directly
    const { processQRPayment } = await import('./src/lib/qr-payment-handler.ts');
    
    const result = await processQRPayment({
      qrPaymentId: createData.qrPaymentId,
      paymentMethod: 'test_payment',
      transactionId: createData.stripePaymentIntentId,
      amount: 100, // Amount in cents
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
    });

    console.log('📋 Order creation result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Order created successfully!');
      console.log('   Order ID:', result.orderId);
    } else {
      console.log('❌ Order creation failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDirectOrderCreation();
