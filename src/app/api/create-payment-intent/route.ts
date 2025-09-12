import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseAdminClient } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const supabaseAdmin = createServerSupabaseAdminClient()
    
    if (!supabaseAdmin) {
      console.error('❌ Supabase admin client not available')
      return NextResponse.json({ error: 'Service unavailable' }, { status: 500 })
    }

    // Get user ID from Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      console.error('Error fetching user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get or create customer record
    let customerId = null
    
    console.log('🔍 Looking for existing customer for user:', user.id)
    
    // First try to find existing customer
    const { data: existingCustomer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.id
      console.log('✅ Found existing customer:', customerId)
    } else {
      // Create new customer record
      const { data: newCustomer, error: createCustomerError } = await supabaseAdmin
        .from('customers')
        .insert({
          user_id: user.id,
          email: session.user.email,
          first_name: session.user.name?.split(' ')[0] || 'Unknown',
          last_name: session.user.name?.split(' ').slice(1).join(' ') || '',
          phone: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (createCustomerError) {
        console.error('Error creating customer:', createCustomerError)
        return NextResponse.json({ error: 'Failed to create customer record' }, { status: 500 })
      }

      customerId = newCustomer.id
      console.log('✅ Created new customer:', customerId)
    }

    const { items, customerInfo, clientTotal } = await request.json()

    // Calculate total amount with test product logic - MUST MATCH CLIENT-SIDE CALCULATION
    const testProductIds = [5] // TEST PRODUCT ID
    
    // Check cart composition
    const hasOnlyTestProducts = items.every((item: any) => testProductIds.includes(item.product.id))
    const hasTestProducts = items.some((item: any) => testProductIds.includes(item.product.id))
    const hasRegularProducts = items.some((item: any) => !testProductIds.includes(item.product.id))
    
    let subtotal = 0
    let shipping = 0
    let tax = 0
    let total = 0
    
    if (hasOnlyTestProducts) {
      // Test products only - charge original price but no shipping/tax
      subtotal = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0)
      shipping = 0
      tax = 0
      total = subtotal + shipping + tax
    } else if (hasTestProducts && hasRegularProducts) {
      // Mixed cart - test products: original price, no tax; regular products: normal pricing
      const testItemsTotal = items
        .filter((item: any) => testProductIds.includes(item.product.id))
        .reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0)
      
      const regularItemsTotal = items
        .filter((item: any) => !testProductIds.includes(item.product.id))
        .reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0)
      
      subtotal = testItemsTotal + regularItemsTotal
      shipping = 0
      tax = regularItemsTotal * 0.08 // Tax only on regular products
      total = subtotal + shipping + tax
    } else {
      // Regular products only - normal pricing
      subtotal = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0)
      shipping = 0
      tax = subtotal * 0.08
      total = subtotal + shipping + tax
    }

    // Log amount calculations for verification
    console.log('💰 Payment Amount Calculation:')
    console.log('  Has Only Test Products:', hasOnlyTestProducts)
    console.log('  Has Mixed Products:', hasTestProducts && hasRegularProducts)
    console.log('  Subtotal:', subtotal)
    console.log('  Shipping:', shipping)
    console.log('  Tax (8%):', tax)
    console.log('  Total:', total)
    console.log('  Client Total:', clientTotal)
    console.log('  Stripe Amount (cents):', Math.round(total * 100))

    // Validate that server calculation matches client calculation
    if (clientTotal && Math.abs(total - clientTotal) > 0.01) {
      console.error('❌ AMOUNT MISMATCH: Server total ($', total, ') != Client total ($', clientTotal, ')')
      return NextResponse.json({ 
        error: 'Amount calculation mismatch. Please refresh and try again.' 
      }, { status: 400 })
    }

    // Generate unique order number
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
    const orderNumber = `ORD-${timestamp}-${randomSuffix}`

    // Create order in database first
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user.id, // Add user ID
        customer_id: customerId, // Add customer ID
        order_number: orderNumber, // Add unique order number
        customer_email: customerInfo.email,
        customer_name: customerInfo.cardholderName,
        customer_phone: customerInfo.phone,
        billing_address: {
          street: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          zip_code: customerInfo.zipCode,
          country: customerInfo.country || 'US'
        },
        subtotal: subtotal,
        shipping_amount: shipping,
        tax_amount: tax,
        discount_amount: 0, // No discount applied
        total: total,
        status: 'pending_payment',
        items: items.map((item: any) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity
        }))
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    console.log('✅ Order created successfully:', {
      orderId: order.id,
      orderNumber: order.order_number,
      customerId: order.customer_id,
      customerEmail: order.customer_email,
      customerName: order.customer_name,
      total: order.total,
      status: order.status,
      itemsCount: order.items.length
    })

    // Note: Test products now have original price but no tax/shipping
    if (hasOnlyTestProducts) {
      console.log('🎁 Test Products - Original Price, No Tax/Shipping')
    }

    // Create Stripe payment intent for paid orders
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        customerEmail: customerInfo.email,
        customerName: customerInfo.cardholderName
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
