// Test Email Notification API - Fixed Version
// Run this with: node test-email-notification-fixed.js

require('dotenv').config({ path: '.env.local' });

async function testEmailNotification() {
  console.log('📧 Testing Email Notification API (Fixed Version)...\n');
  
  try {
    // First, let's get a real order ID from the database
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    console.log('🔍 Fetching latest order from database...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_number, customer_email, customer_name, customer_phone, billing_address, items')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError);
      return;
    }
    
    if (!orders || orders.length === 0) {
      console.log('❌ No orders found in database');
      return;
    }
    
    const order = orders[0];
    console.log('📋 Found order:', {
      id: order.id,
      order_number: order.order_number,
      customer_email: order.customer_email,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone
    });
    
    console.log('\n🚀 Testing email notification...');
    
    const response = await fetch('http://localhost:3000/api/send-order-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: order.id
      }),
    });
    
    console.log('📊 Response Status:', response.status);
    
    const result = await response.json();
    console.log('📋 Response Body:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Email notification test successful!');
      if (result.email?.success) {
        console.log('📧 Email sent successfully!');
      } else {
        console.log('⚠️ Email not sent (SMTP not configured):', result.email?.message);
        console.log('📧 Email content preview:', result.email?.emailContent?.substring(0, 200) + '...');
      }
    } else {
      console.log('❌ Email notification test failed:', result.error);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('');
    console.log('🔧 Make sure:');
    console.log('1. Your Next.js app is running (npm run dev)');
    console.log('2. You have orders in your database');
    console.log('3. Your .env.local file is properly configured');
  }
}

testEmailNotification();
