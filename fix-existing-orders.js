// Fix existing orders by setting customer_name based on email
// Run this with: node fix-existing-orders.js

require('dotenv').config({ path: '.env.local' });

async function fixExistingOrders() {
  console.log('🔧 Fixing existing orders...\n');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Get all orders with null customer_name
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, customer_email, customer_name')
      .is('customer_name', null);
    
    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError);
      return;
    }
    
    if (!orders || orders.length === 0) {
      console.log('✅ No orders need fixing - all have customer names');
      return;
    }
    
    console.log(`📋 Found ${orders.length} orders to fix\n`);
    
    for (const order of orders) {
      // Extract name from email (simple approach)
      const email = order.customer_email;
      if (email) {
        const emailName = email.split('@')[0];
        const customerName = emailName.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        console.log(`🔧 Updating order ${order.id}:`);
        console.log(`  Email: ${email}`);
        console.log(`  Setting customer_name: ${customerName}`);
        
        const { error: updateError } = await supabase
          .from('orders')
          .update({ customer_name: customerName })
          .eq('id', order.id);
        
        if (updateError) {
          console.error(`❌ Error updating order ${order.id}:`, updateError);
        } else {
          console.log(`✅ Updated order ${order.id}`);
        }
        console.log('');
      }
    }
    
    console.log('🎉 Finished fixing existing orders!');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

fixExistingOrders();
