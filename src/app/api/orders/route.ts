import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/get-session';
import { createServerSupabaseAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Orders API called for new clean system');
    
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const supabaseAdmin = createServerSupabaseAdminClient();
    
    // Get the actual user ID from the database using email
    const { data: dbUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', session.user.email.toLowerCase())
      .single();
    
    if (userError || !dbUser) {
      console.error('❌ Failed to find user in database:', userError);
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }
    
    console.log('✅ User authenticated:', dbUser.id);

    const { items, billingInfo, subtotal: frontendSubtotal, taxAmount: frontendTaxAmount, total: frontendTotal } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid items data' },
        { status: 400 }
      );
    }

    if (!billingInfo) {
      return NextResponse.json(
        { error: 'Billing information is required' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = frontendSubtotal ? Number(frontendSubtotal) : Number(items.reduce((total: number, item: any) => {
      return total + (Number(item.price) * Number(item.quantity));
    }, 0));

    const taxAmount = frontendTaxAmount ? Number(frontendTaxAmount) : Number((subtotal * 0.08).toFixed(2));
    const total = frontendTotal ? Number(frontendTotal) : Number((subtotal + taxAmount).toFixed(2));

    console.log('📊 Order totals:', { subtotal, taxAmount, total });

    // Validate calculations
    if (isNaN(total) || total <= 0) {
      return NextResponse.json(
        { error: 'Invalid total calculation' },
        { status: 400 }
      );
    }

    // Check if customer already exists for this user and email
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('user_id', dbUser.id)
      .eq('email', billingInfo.email.toLowerCase())
      .single();

    let customer;
    
    if (existingCustomer) {
      // Update existing customer with latest billing info
      const { data: updatedCustomer, error: updateError } = await supabaseAdmin
        .from('customers')
        .update({
          first_name: billingInfo.firstName,
          last_name: billingInfo.lastName,
          phone: billingInfo.phone,
          company: billingInfo.company || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCustomer.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Failed to update customer:', updateError);
        throw new Error('Failed to update customer record');
      }
      
      customer = updatedCustomer;
      console.log('✅ Customer updated:', customer.id);
    } else {
      // Create new customer record
      const { data: newCustomer, error: customerError } = await supabaseAdmin
        .from('customers')
        .insert({
          user_id: dbUser.id,
          first_name: billingInfo.firstName,
          last_name: billingInfo.lastName,
          email: billingInfo.email,
          phone: billingInfo.phone,
          company: billingInfo.company || null
        })
        .select()
        .single();

      if (customerError) {
        console.error('❌ Failed to create customer:', customerError);
        throw new Error('Failed to create customer record');
      }
      
      customer = newCustomer;
      console.log('✅ Customer created:', customer.id);
    }

    // Customer ready for order creation
    console.log('✅ Customer ready with user_id:', dbUser.id);

    // Create billing address
    const { data: billingAddress, error: addressError } = await supabaseAdmin
      .from('customer_addresses')
      .insert({
        user_id: dbUser.id,
        order_id: null, // Will be set after order creation
        address_type: 'billing',
        first_name: billingInfo.firstName,
        last_name: billingInfo.lastName,
        company: billingInfo.company || null,
        address_line_1: billingInfo.address,
        address_line_2: billingInfo.addressLine2 || null,
        city: billingInfo.city,
        state: billingInfo.state,
        postal_code: billingInfo.zipCode,
        country: 'US',
        phone: billingInfo.phone,
        email: billingInfo.email,
        is_default: true
      })
      .select()
      .single();

    if (addressError) {
      console.error('❌ Failed to create billing address:', addressError);
      throw new Error('Failed to create billing address');
    }

    console.log('✅ Billing address created:', billingAddress.id);

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create order with basic structure
    const orderData = {
      user_id: dbUser.id,
      customer_id: customer.id, // Link to the customer record
      order_number: orderNumber, // Add the generated order number
      billing_address_id: billingAddress.id, // Link to the billing address
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.img
      })),
      subtotal: subtotal,
      tax_amount: taxAmount,
      shipping_amount: 0,
      discount_amount: 0,
      total: total,
      currency: 'usd',
      status: 'pending_payment',
      notes: 'Order created from checkout - awaiting payment'
    };

    console.log('📋 Creating order with data:', orderData);

    // Create the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('❌ Failed to create order:', orderError);
      throw new Error('Failed to create order');
    }

    console.log('✅ Order created successfully:', order.id);

    // Update billing address with order ID
    const updateAddressResponse = await supabaseAdmin
      .from('customer_addresses')
      .update({ order_id: order.id })
      .eq('id', billingAddress.id);

    if (updateAddressResponse.error) {
      console.error('❌ Failed to update billing address with order ID:', updateAddressResponse.error);
    } else {
      console.log('✅ Billing address linked to order');
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order created successfully'
    });

  } catch (error: any) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabaseAdmin = createServerSupabaseAdminClient();
    
    // Get the actual user ID from the database using email
    const { data: dbUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', session.user.email.toLowerCase())
      .single();
    
    if (userError || !dbUser) {
      console.error('❌ Failed to find user in database:', userError);
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }
    
    // Get orders with customer information (removed payment_transactions join due to missing relationship)
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        customers!inner(
          first_name,
          last_name,
          email,
          phone,
          company
        )
      `)
      .eq('user_id', dbUser.id)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Transform the data for frontend consumption
    const transformedOrders = orders.map(order => {
      // Determine payment status based on order status and available data
      let paymentStatus = 'pending';
      let paymentIntentId = null;
      let paymentMethod = null;
      
      // If order is marked as paid, payment was successful
      if (order.status === 'paid' || order.paid_at) {
        paymentStatus = 'succeeded';
      }
      // If order status indicates payment failure
      else if (order.status === 'payment_failed' || order.status === 'failed') {
        paymentStatus = 'failed';
      }
      // If order has a payment intent ID, it was processed
      else if (order.payment_intent_id) {
        paymentStatus = 'succeeded';
        paymentIntentId = order.payment_intent_id;
      }
      // Otherwise, payment is pending
      else {
        paymentStatus = 'pending';
      }
      
      // Determine payment method if available
      if (order.payment_method) {
        paymentMethod = order.payment_method;
      } else if (order.payment_intent_id) {
        paymentMethod = 'stripe'; // Default to Stripe if we have a payment intent
      }
      
      return {
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        subtotal: order.subtotal,
        tax_amount: order.tax_amount,
        shipping_amount: order.shipping_amount,
        discount_amount: order.discount_amount,
        total: order.total,
        currency: order.currency,
        created_at: order.created_at,
        updated_at: order.updated_at,
        paid_at: order.paid_at,
        notes: order.notes,
        tracking_number: order.tracking_number,
        estimated_delivery_date: order.estimated_delivery_date,
        // Transform JSONB items to expected order_items format
        order_items: Array.isArray(order.items) ? order.items.map((item: any) => ({
          id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          product_image: item.image
        })) : [],
        customer: {
          firstName: order.customers.first_name,
          lastName: order.customers.last_name,
          email: order.customers.email,
          phone: order.customers.phone,
          company: order.customers.company
        },
        billing_address: null, // Will be added later when we fix the relationship
        shipping_address: null, // Will be added later when we fix the relationship
        payment: null, // Payment data not available due to missing relationship
        // Add payment status for easier access
        payment_status: paymentStatus,
        payment_intent_id: paymentIntentId,
        payment_method: paymentMethod
      };
    });

    return NextResponse.json({ orders: transformedOrders });

  } catch (error) {
    console.error('❌ Error in GET orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
