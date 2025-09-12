#!/usr/bin/env node

/**
 * QR Payment Fix Test Script
 * 
 * This script helps test and debug QR payment issues.
 * It simulates the QR payment flow and checks if orders are created properly.
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testQRPaymentFlow() {
  console.log('🧪 Testing QR Payment Flow...\n');

  try {
    // 1. Check recent QR payments
    console.log('1️⃣ Checking recent QR payments...');
    const { data: qrPayments, error: qrError } = await supabase
      .from('qr_payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (qrError) {
      console.error('❌ Error fetching QR payments:', qrError);
      return;
    }

    console.log(`✅ Found ${qrPayments.length} recent QR payments:`);
    qrPayments.forEach((payment, index) => {
      console.log(`   ${index + 1}. ID: ${payment.id}`);
      console.log(`      Status: ${payment.status}`);
      console.log(`      Amount: $${(payment.amount / 100).toFixed(2)}`);
      console.log(`      Created: ${payment.created_at}`);
      console.log(`      Completed: ${payment.completed_at || 'Not completed'}`);
      console.log('');
    });

    // 2. Check for completed QR payments without orders
    console.log('2️⃣ Checking for completed QR payments without orders...');
    const completedPayments = qrPayments.filter(p => p.status === 'completed');
    
    for (const payment of completedPayments) {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, order_number, status, payment_reference')
        .eq('payment_reference', payment.id)
        .single();

      if (orderError && orderError.code === 'PGRST116') {
        console.log(`⚠️  QR Payment ${payment.id} is completed but has no order`);
        console.log(`   Amount: $${(payment.amount / 100).toFixed(2)}`);
        console.log(`   Customer: ${payment.customer_info?.name || 'Unknown'}`);
        console.log(`   Items: ${payment.customer_info?.items?.length || 0} items`);
        console.log('');
      } else if (order) {
        console.log(`✅ QR Payment ${payment.id} has order ${order.id} (${order.order_number})`);
      }
    }

    // 3. Check recent orders
    console.log('3️⃣ Checking recent orders...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_number, status, payment_status, payment_reference, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError);
      return;
    }

    console.log(`✅ Found ${orders.length} recent orders:`);
    orders.forEach((order, index) => {
      console.log(`   ${index + 1}. Order: ${order.order_number}`);
      console.log(`      Status: ${order.status}`);
      console.log(`      Payment Status: ${order.payment_status}`);
      console.log(`      Payment Reference: ${order.payment_reference || 'None'}`);
      console.log(`      Created: ${order.created_at}`);
      console.log('');
    });

    // 4. Check webhook configuration
    console.log('4️⃣ Webhook Configuration Check:');
    console.log('   STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing');
    console.log('   STRIPE_QR_WEBHOOK_SECRET:', process.env.STRIPE_QR_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing');
    console.log('   NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || '❌ Missing');
    console.log('');

    // 5. Recommendations
    console.log('5️⃣ Recommendations:');
    console.log('   • Ensure Stripe webhook is configured for checkout.session.completed events');
    console.log('   • Check webhook endpoint: /api/webhook/stripe-checkout');
    console.log('   • Verify webhook secret is correctly set in environment variables');
    console.log('   • Test webhook using Stripe CLI: stripe listen --forward-to localhost:3000/api/webhook/stripe-checkout');
    console.log('');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
if (require.main === module) {
  testQRPaymentFlow().then(() => {
    console.log('🏁 QR Payment test completed');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
}

module.exports = { testQRPaymentFlow };
