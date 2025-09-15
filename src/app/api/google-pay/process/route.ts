import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { paymentData, customerInfo, total } = await request.json()

    if (!paymentData || !customerInfo || !total) {
      return NextResponse.json(
        { error: 'Payment data, customer info, and total are required' },
        { status: 400 }
      )
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        payment_method: 'google_pay',
        customer_email: customerInfo.email,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone || '',
        order_type: 'mobile_payment'
      },
      description: `Google Pay - ${customerInfo.name}`,
      receipt_email: customerInfo.email,
    })

    // Create order record
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    const orderData = {
      order_number: orderNumber,
      user_id: customerInfo.user_id || null,
      customer_email: customerInfo.email,
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone || '',
      customer_info: customerInfo,
      items: customerInfo.items || [],
      subtotal: total * 0.9, // Approximate subtotal (90% of total)
      tax_amount: total * 0.1, // Approximate tax (10% of total)
      shipping_amount: 0,
      discount_amount: 0,
      total: total,
      currency: 'usd',
      status: 'paid',
      payment_status: 'succeeded',
      payment_intent_id: paymentIntent.id,
      payment_method: 'Google Pay',
      notes: 'Google Pay payment completed'
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create payment transaction record
    try {
      await supabase
        .from('payment_transactions')
        .insert({
          order_id: order.id,
          stripe_payment_intent_id: paymentIntent.id,
          amount: Math.round(total * 100), // Amount in cents
          currency: 'usd',
          status: 'succeeded',
          payment_method_id: paymentIntent.id,
          payment_method_type: 'google_pay'
        })
    } catch (transactionError) {
      console.error('Payment transaction creation error:', transactionError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: orderNumber,
      paymentIntentId: paymentIntent.id,
      status: 'succeeded'
    })

  } catch (error) {
    console.error('Google Pay processing error:', error)
    return NextResponse.json(
      { error: 'Google Pay processing failed' },
      { status: 500 }
    )
  }
}
