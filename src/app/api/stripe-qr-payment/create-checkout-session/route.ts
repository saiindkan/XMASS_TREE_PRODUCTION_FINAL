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

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrPaymentId } = body

    if (!qrPaymentId) {
      return NextResponse.json(
        { error: 'QR Payment ID is required' },
        { status: 400 }
      )
    }

    // Get QR payment record
    const { data: qrPayment, error: qrError } = await supabase
      .from('qr_payments')
      .select('*')
      .eq('id', qrPaymentId)
      .single()

    if (qrError || !qrPayment) {
      return NextResponse.json(
        { error: 'QR payment not found' },
        { status: 404 }
      )
    }

    // Check if payment has expired
    if (new Date(qrPayment.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Payment session has expired' },
        { status: 410 }
      )
    }

    // Check if already completed
    if (qrPayment.status === 'completed') {
      return NextResponse.json(
        { error: 'Payment already completed' },
        { status: 409 }
      )
    }

    // Get Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.retrieve(qrPayment.transaction_id)

    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json({
        success: true,
        status: 'completed',
        message: 'Payment already completed'
      })
    }

    // Create Stripe Checkout Session for mobile payments
    const session = await stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          qr_payment_id: qrPaymentId,
          order_type: 'qr_payment'
        }
      },
      line_items: qrPayment.customer_info.items.map((item: any) => ({
        price_data: {
          currency: qrPayment.currency || 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/order-confirmation?qr_payment_id=${qrPaymentId}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/qr-pay/${qrPaymentId}`,
      customer_email: qrPayment.customer_info.email,
      metadata: {
        qr_payment_id: qrPaymentId,
        customer_name: qrPayment.customer_info.name,
        customer_email: qrPayment.customer_info.email,
      },
      // Enable mobile payment methods
      payment_method_types: ['card'],
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      // Enable Apple Pay and Google Pay
      payment_method_configuration: undefined, // Use default configuration
    })

    // Update QR payment with checkout session ID
    await supabase
      .from('qr_payments')
      .update({
        checkout_session_id: session.id,
        notes: `Stripe Checkout Session: ${session.id}`
      })
      .eq('id', qrPaymentId)

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      message: 'Checkout session created successfully'
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
