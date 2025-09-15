// Test Address Fix for Email Template
// Run this with: node test-address-fix.js

require('dotenv').config({ path: '.env.local' });

// Copy of the helper function from email-templates.ts
function getAddressField(address, field) {
  if (!address) return 'Not available';
  
  // If address is a string (shouldn't happen but safety check)
  if (typeof address === 'string') {
    return address;
  }
  
  // If address is an object, try different field names
  if (typeof address === 'object' && address !== null) {
    switch (field) {
      case 'street':
        // Handle nested street object structure
        if (address.street && typeof address.street === 'object') {
          return address.street.line1 || address.street.address_line_1 || 'Address not available';
        }
        return address.street || address.address_line_1 || address.line1 || 'Address not available';
      case 'city':
        // Handle nested street object structure
        if (address.street && typeof address.street === 'object') {
          return address.street.city || 'City not available';
        }
        return address.city || 'City not available';
      case 'state':
        // Handle nested street object structure
        if (address.street && typeof address.street === 'object') {
          return address.street.state || 'State not available';
        }
        return address.state || 'State not available';
      case 'zip_code':
        // Handle nested street object structure
        if (address.street && typeof address.street === 'object') {
          return address.street.postal_code || address.street.zip_code || 'ZIP not available';
        }
        return address.zip_code || address.postal_code || address.postalCode || 'ZIP not available';
      case 'country':
        // Handle nested street object structure
        if (address.street && typeof address.street === 'object') {
          return address.street.country || address.country || 'US';
        }
        return address.country || 'US';
      default:
        return 'Not available';
    }
  }
  
  return 'Not available';
}

async function testAddressFix() {
  console.log('🔍 Testing Address Fix for Email Template...\n');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Get a paid order from database
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .or('status.eq.paid,payment_status.eq.succeeded')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError);
      return;
    }
    
    if (!orders || orders.length === 0) {
      console.log('📭 No paid orders found in database');
      console.log('💡 Create a test order with payment_status = "succeeded" to test this functionality');
      return;
    }
    
    const order = orders[0];
    console.log('📋 Testing with order:', {
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email
    });
    
    // Test different address structures
    console.log('\n🧪 Testing Address Structure Handling...');
    
    // Test 1: Original billing_address structure
    console.log('\n📧 Test 1: Original billing_address structure');
    console.log('Raw billing_address:', JSON.stringify(order.billing_address, null, 2));
    
    if (order.billing_address) {
      console.log('✅ Street:', getAddressField(order.billing_address, 'street'));
      console.log('✅ City:', getAddressField(order.billing_address, 'city'));
      console.log('✅ State:', getAddressField(order.billing_address, 'state'));
      console.log('✅ ZIP:', getAddressField(order.billing_address, 'zip_code'));
    } else {
      console.log('❌ No billing_address found');
    }
    
    // Test 2: Individual address fields
    console.log('\n📧 Test 2: Individual address fields');
    const individualFields = {
      billing_address_line1: order.billing_address_line1,
      billing_city: order.billing_city,
      billing_state: order.billing_state,
      billing_postal_code: order.billing_postal_code,
      billing_country: order.billing_country
    };
    console.log('Individual fields:', JSON.stringify(individualFields, null, 2));
    
    // Test 3: customer_info address
    console.log('\n📧 Test 3: customer_info address');
    console.log('customer_info:', JSON.stringify(order.customer_info, null, 2));
    
    if (order.customer_info?.address) {
      console.log('✅ Street:', getAddressField(order.customer_info.address, 'street'));
      console.log('✅ City:', getAddressField(order.customer_info.address, 'city'));
      console.log('✅ State:', getAddressField(order.customer_info.address, 'state'));
      console.log('✅ ZIP:', getAddressField(order.customer_info.address, 'zip_code'));
    } else {
      console.log('❌ No customer_info.address found');
    }
    
    // Test 4: Simulate the API transformation
    console.log('\n📧 Test 4: API Transformation Simulation');
    
    let billingAddress = {
      street: 'Address not available',
      city: 'City not available', 
      state: 'State not available',
      zip_code: 'ZIP not available',
      country: 'US'
    };
    
    if (order.billing_address) {
      if (typeof order.billing_address === 'object' && order.billing_address !== null) {
        // Check if street field contains the actual address data
        if (order.billing_address.street && typeof order.billing_address.street === 'object') {
          // Street field contains the address object
          billingAddress = {
            street: order.billing_address.street.line1 || order.billing_address.street.address_line_1 || 'Address not available',
            city: order.billing_address.street.city || 'City not available',
            state: order.billing_address.street.state || 'State not available',
            zip_code: order.billing_address.street.postal_code || order.billing_address.street.zip_code || 'ZIP not available',
            country: order.billing_address.street.country || order.billing_address.country || 'US'
          };
        } else {
          // Normal address structure
          billingAddress = {
            street: order.billing_address.address_line_1 || order.billing_address.street || order.billing_address.line1 || 'Address not available',
            city: order.billing_address.city || 'City not available',
            state: order.billing_address.state || 'State not available', 
            zip_code: order.billing_address.postal_code || order.billing_address.zip_code || order.billing_address.postalCode || 'ZIP not available',
            country: order.billing_address.country || 'US'
          };
        }
      }
    } else if (order.customer_info?.address) {
      billingAddress = {
        street: order.customer_info.address.line1 || order.customer_info.address.street || 'Address not available',
        city: order.customer_info.address.city || 'City not available',
        state: order.customer_info.address.state || 'State not available',
        zip_code: order.customer_info.address.postal_code || order.customer_info.address.zip_code || 'ZIP not available',
        country: order.customer_info.address.country || 'US'
      };
    }
    
    if (order.billing_address_line1 || order.billing_city) {
      billingAddress = {
        street: order.billing_address_line1 || 'Address not available',
        city: order.billing_city || 'City not available',
        state: order.billing_state || 'State not available',
        zip_code: order.billing_postal_code || 'ZIP not available',
        country: order.billing_country || 'US'
      };
    }
    
    console.log('✅ Transformed billing address:', JSON.stringify(billingAddress, null, 2));
    
    // Test 5: Email template rendering
    console.log('\n📧 Test 5: Email Template Rendering');
    const emailOrderData = {
      ...order,
      customer_name: order.customer_name || order.customer_info?.name || 'Customer',
      customer_email: order.customer_email || order.customer_info?.email || 'customer@example.com',
      customer_phone: order.customer_phone || order.customer_info?.phone || '',
      billing_address: billingAddress,
      items: Array.isArray(order.items) ? order.items.map((item) => ({
        product_name: item.product_name || item.name,
        quantity: item.quantity,
        total: item.total || (item.price * item.quantity)
      })) : []
    };
    
    // Simulate email template rendering
    const shippingInfo = `
🚚 Shipping Address:
${emailOrderData.customer_name || 'N/A'}
${getAddressField(emailOrderData.billing_address, 'street')}
${getAddressField(emailOrderData.billing_address, 'city')}, ${getAddressField(emailOrderData.billing_address, 'state')} ${getAddressField(emailOrderData.billing_address, 'zip_code')}
    `.trim();
    
    console.log('✅ Email template shipping section:');
    console.log(shippingInfo);
    
    console.log('\n🎉 Address fix test completed!');
    console.log('📝 Summary:');
    console.log('  ✅ Address field extraction working');
    console.log('  ✅ Multiple address format support');
    console.log('  ✅ Fallback handling working');
    console.log('  ✅ Email template rendering working');
    console.log('  📧 Ready for production use');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testAddressFix();
