#!/usr/bin/env node

/**
 * Test script for Stripe QR Payment System
 * Run with: node test-qr-payment.js
 */

// Use built-in fetch (Node.js 18+)
const fetch = globalThis.fetch;

const BASE_URL = 'http://localhost:3000';

async function testQRPayment() {
  console.log('🧪 Testing Stripe QR Payment System...\n');

  try {
    // Test 1: Create QR Payment
    console.log('1️⃣ Creating QR Payment...');
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
    console.log('   Stripe Payment Intent ID:', createData.stripePaymentIntentId);
    console.log('   Amount: $' + createData.amount);
    console.log('   Expires At:', createData.expiresAt);
    console.log('');

    // Test 2: Check Payment Status
    console.log('2️⃣ Checking Payment Status...');
    const statusResponse = await fetch(`${BASE_URL}/api/stripe-qr-payment/status?qrPaymentId=${createData.qrPaymentId}`);
    const statusData = await statusResponse.json();
    
    if (statusData.error) {
      console.error('❌ Status check failed:', statusData.error);
      return;
    }

    console.log('✅ Status check successful!');
    console.log('   Status:', statusData.status);
    console.log('   Stripe Status:', statusData.stripeStatus);
    console.log('   Amount: $' + statusData.amount);
    console.log('   Currency:', statusData.currency);
    console.log('');

    // Test 3: Simulate Payment Processing
    console.log('3️⃣ Simulating Payment Processing...');
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

    console.log('✅ Payment processing successful!');
    console.log('   Status:', processData.status);
    console.log('   Payment Intent ID:', processData.paymentIntentId);
    console.log('');

    // Test 4: Final Status Check
    console.log('4️⃣ Final Status Check...');
    const finalStatusResponse = await fetch(`${BASE_URL}/api/stripe-qr-payment/status?qrPaymentId=${createData.qrPaymentId}`);
    const finalStatusData = await finalStatusResponse.json();
    
    if (finalStatusData.error) {
      console.error('❌ Final status check failed:', finalStatusData.error);
      return;
    }

    console.log('✅ Final status check successful!');
    console.log('   Status:', finalStatusData.status);
    console.log('   Stripe Status:', finalStatusData.stripeStatus);
    console.log('   Payment Method:', finalStatusData.paymentMethod);
    console.log('');

    console.log('🎉 All tests passed! QR Payment System is working correctly.');
    console.log('');
    console.log('📱 Next Steps:');
    console.log('   1. Add your Stripe keys to .env.local');
    console.log('   2. Test with real mobile payment apps');
    console.log('   3. Set up webhooks for production');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure the development server is running (npm run dev)');
    console.log('   2. Check your .env.local file has Stripe keys');
    console.log('   3. Verify the database is accessible');
  }
}

// Run the test
testQRPayment();
