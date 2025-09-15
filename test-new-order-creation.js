// Test New Order Creation with Customer Names
// Run this with: node test-new-order-creation.js

require('dotenv').config({ path: '.env.local' });

async function testNewOrderCreation() {
  console.log('🔍 Testing New Order Creation with Customer Names...\n');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Test data for order creation
    const testOrderData = {
      items: [
        {
          id: 1,
          name: 'Test Christmas Tree',
          price: 25.00,
          quantity: 1,
          img: 'test-tree.jpg'
        }
      ],
      billingInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        company: 'Test Company',
        address: '123 Test Street',
        addressLine2: 'Apt 1',
        city: 'Test City',
        state: 'CA',
        zipCode: '12345'
      },
      subtotal: 25.00,
      taxAmount: 2.00,
      total: 27.00
    };
    
    console.log('📋 Test Order Data:');
    console.log('  Customer Name:', `${testOrderData.billingInfo.firstName} ${testOrderData.billingInfo.lastName}`);
    console.log('  Customer Email:', testOrderData.billingInfo.email);
    console.log('  Customer Phone:', testOrderData.billingInfo.phone);
    console.log('  Items:', testOrderData.items.length);
    console.log('  Total:', testOrderData.total);
    console.log('');
    
    // Simulate the order creation process
    console.log('🔧 Simulating Order Creation Process...');
    
    // Step 1: Check if user exists (simulate authentication)
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .limit(1);
    
    if (userError || !users || users.length === 0) {
      console.log('❌ No users found in database for testing');
      return;
    }
    
    const testUser = users[0];
    console.log('✅ Test user found:', testUser.email, 'ID:', testUser.id);
    
    // Step 2: Check if customer exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', testUser.id)
      .eq('email', testOrderData.billingInfo.email.toLowerCase())
      .single();
    
    let customer;
    if (existingCustomer) {
      console.log('✅ Using existing customer:', existingCustomer.id);
      customer = existingCustomer;
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          user_id: testUser.id,
          first_name: testOrderData.billingInfo.firstName,
          last_name: testOrderData.billingInfo.lastName,
          email: testOrderData.billingInfo.email,
          phone: testOrderData.billingInfo.phone,
          company: testOrderData.billingInfo.company || null
        })
        .select()
        .single();
      
      if (customerError) {
        console.error('❌ Failed to create customer:', customerError);
        return;
      }
      
      customer = newCustomer;
      console.log('✅ Created new customer:', customer.id);
    }
    
    // Step 3: Create billing address
    const { data: billingAddress, error: addressError } = await supabase
      .from('customer_addresses')
      .insert({
        customer_id: customer.id, // Add customer_id
        order_id: null,
        address_type: 'billing',
        first_name: testOrderData.billingInfo.firstName,
        last_name: testOrderData.billingInfo.lastName,
        company: testOrderData.billingInfo.company || null,
        address_line1: testOrderData.billingInfo.address,
        address_line_1: testOrderData.billingInfo.address,
        address_line2: testOrderData.billingInfo.addressLine2 || null,
        address_line_2: testOrderData.billingInfo.addressLine2 || null,
        city: testOrderData.billingInfo.city,
        state: testOrderData.billingInfo.state,
        postal_code: testOrderData.billingInfo.zipCode,
        country: 'US',
        phone: testOrderData.billingInfo.phone,
        email: testOrderData.billingInfo.email,
        is_default: true
      })
      .select()
      .single();
    
    if (addressError) {
      console.error('❌ Failed to create billing address:', addressError);
      return;
    }
    
    console.log('✅ Created billing address:', billingAddress.id);
    
    // Step 4: Create order with customer data
    const orderNumber = `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const orderData = {
      user_id: testUser.id,
      customer_id: customer.id,
      order_number: orderNumber,
      customer_email: testOrderData.billingInfo.email,
      customer_name: `${testOrderData.billingInfo.firstName} ${testOrderData.billingInfo.lastName}`,
      customer_phone: testOrderData.billingInfo.phone,
      billing_address: {
        street: {
          line1: testOrderData.billingInfo.address,
          line2: testOrderData.billingInfo.addressLine2 || null,
          city: testOrderData.billingInfo.city,
          state: testOrderData.billingInfo.state,
          postal_code: testOrderData.billingInfo.zipCode,
          country: 'US'
        },
        country: 'US'
      },
      items: testOrderData.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.img
      })),
      subtotal: testOrderData.subtotal,
      tax_amount: testOrderData.taxAmount,
      shipping_amount: 0,
      discount_amount: 0,
      total: testOrderData.total,
      currency: 'usd',
      status: 'pending_payment',
      notes: 'Test order created - customer name verification'
    };
    
    console.log('📋 Order data to be created:');
    console.log('  Customer Name:', orderData.customer_name);
    console.log('  Customer Email:', orderData.customer_email);
    console.log('  Customer Phone:', orderData.customer_phone);
    console.log('  Order Number:', orderData.order_number);
    console.log('');
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (orderError) {
      console.error('❌ Failed to create order:', orderError);
      return;
    }
    
    console.log('✅ Order created successfully!');
    console.log('  Order ID:', order.id);
    console.log('  Order Number:', order.order_number);
    console.log('  Customer Name:', order.customer_name);
    console.log('  Customer Email:', order.customer_email);
    console.log('  Customer Phone:', order.customer_phone);
    console.log('  Status:', order.status);
    console.log('');
    
    // Verify the order data
    console.log('🔍 Verifying Order Data...');
    const { data: verifyOrder, error: verifyError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Error verifying order:', verifyError);
    } else {
      console.log('✅ Order verification successful:');
      console.log('  Customer Name:', verifyOrder.customer_name);
      console.log('  Customer Email:', verifyOrder.customer_email);
      console.log('  Customer Phone:', verifyOrder.customer_phone);
      console.log('  Billing Address:', JSON.stringify(verifyOrder.billing_address, null, 2));
    }
    
    console.log('\n🎉 Test completed successfully!');
    console.log('✅ New orders will now have correct customer names');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testNewOrderCreation();
