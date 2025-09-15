// Test Orders Page Data Structure
// Run this with: node test-orders-page.js

require('dotenv').config({ path: '.env.local' });

async function testOrdersPage() {
  console.log('🔍 Testing Orders Page Data Structure...\n');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    console.log('📋 Fetching orders from database...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2);
    
    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError);
      return;
    }
    
    if (!orders || orders.length === 0) {
      console.log('📭 No orders found in database');
      return;
    }
    
    console.log(`✅ Found ${orders.length} orders\n`);
    
    orders.forEach((order, index) => {
      console.log(`📦 Order ${index + 1}:`);
      console.log('  ID:', order.id);
      console.log('  Order Number:', order.order_number);
      console.log('  Status:', order.status);
      console.log('  Payment Status:', order.payment_status);
      console.log('  Customer Email:', order.customer_email);
      console.log('  Customer Name:', order.customer_name);
      console.log('  Customer Phone:', order.customer_phone);
      console.log('  Total:', order.total);
      
      console.log('  Items:');
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item, itemIndex) => {
          console.log(`    ${itemIndex + 1}. ${item.product_name || item.name} - Qty: ${item.quantity} - $${item.total || (item.price * item.quantity)}`);
        });
      } else {
        console.log('    No items data');
      }
      
      console.log('  Billing Address:');
      if (order.billing_address) {
        if (order.billing_address.street) {
          console.log('    Street:', order.billing_address.street.line1);
          console.log('    City:', order.billing_address.street.city);
          console.log('    State:', order.billing_address.street.state);
          console.log('    ZIP:', order.billing_address.street.postal_code);
          console.log('    Country:', order.billing_address.street.country);
        } else {
          console.log('    Address Line 1:', order.billing_address.address_line_1);
          console.log('    City:', order.billing_address.city);
          console.log('    State:', order.billing_address.state);
          console.log('    ZIP:', order.billing_address.postal_code);
          console.log('    Country:', order.billing_address.country);
        }
      } else {
        console.log('    No billing address');
      }
      
      console.log('');
    });
    
    // Test the data transformation logic
    console.log('🔧 Testing Data Transformation Logic...\n');
    
    const testOrder = orders[0];
    
    // Test customer data transformation
    const customerData = {
      firstName: testOrder.customer_name?.split(' ')[0] || 'Customer',
      lastName: testOrder.customer_name?.split(' ').slice(1).join(' ') || 'User',
      email: testOrder.customer_email || 'customer@example.com',
      phone: testOrder.customer_phone || '',
      company: ''
    };
    
    console.log('📧 Transformed Customer Data:');
    console.log('  First Name:', customerData.firstName);
    console.log('  Last Name:', customerData.lastName);
    console.log('  Email:', customerData.email);
    console.log('  Phone:', customerData.phone);
    console.log('  Company:', customerData.company);
    
    // Test billing address transformation
    const billingAddress = testOrder.billing_address ? {
      address_line_1: testOrder.billing_address.street?.line1 || testOrder.billing_address.address_line_1 || 'Address not available',
      address_line_2: testOrder.billing_address.street?.line2 || testOrder.billing_address.address_line_2 || null,
      city: testOrder.billing_address.street?.city || testOrder.billing_address.city || 'City not available',
      state: testOrder.billing_address.street?.state || testOrder.billing_address.state || 'State not available',
      postal_code: testOrder.billing_address.street?.postal_code || testOrder.billing_address.zip_code || testOrder.billing_address.postal_code || 'ZIP not available',
      country: testOrder.billing_address.street?.country || testOrder.billing_address.country || 'US',
      phone: testOrder.customer_phone || testOrder.billing_address.phone || null,
      email: testOrder.customer_email || testOrder.billing_address.email || null
    } : null;
    
    console.log('\n🏠 Transformed Billing Address:');
    if (billingAddress) {
      console.log('  Address Line 1:', billingAddress.address_line_1);
      console.log('  Address Line 2:', billingAddress.address_line_2);
      console.log('  City:', billingAddress.city);
      console.log('  State:', billingAddress.state);
      console.log('  ZIP:', billingAddress.postal_code);
      console.log('  Country:', billingAddress.country);
      console.log('  Phone:', billingAddress.phone);
      console.log('  Email:', billingAddress.email);
    } else {
      console.log('  No billing address available');
    }
    
    // Test items transformation
    const orderItems = Array.isArray(testOrder.items) ? testOrder.items.map((item) => ({
      id: item.id || item.product_id,
      product_name: item.product_name || item.name,
      quantity: item.quantity,
      total_price: item.total || (item.price * item.quantity),
      product_image: item.image || item.product_image
    })) : [];
    
    console.log('\n📦 Transformed Order Items:');
    orderItems.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.product_name} - Qty: ${item.quantity} - $${item.total_price}`);
    });
    
    console.log('\n✅ Orders page data structure test completed!');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testOrdersPage();
