import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { processQRPayment } from '@/lib/qr-payment-handler'

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
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_QR_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('🔔 Stripe QR Webhook received:', event.type)

    // Handle payment intent events
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentSuccess(paymentIntent)
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentFailure(paymentIntent)
    } else if (event.type === 'payment_intent.canceled') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentCancellation(paymentIntent)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('✅ Payment succeeded:', paymentIntent.id)

    // Find QR payment record by Stripe Payment Intent ID
    const { data: qrPayment, error: qrError } = await supabase
      .from('qr_payments')
      .select('*')
      .eq('transaction_id', paymentIntent.id)
      .single()

    if (qrError || !qrPayment) {
      console.error('QR payment not found for Payment Intent:', paymentIntent.id)
      return
    }

    // Update QR payment status
    await supabase
      .from('qr_payments')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        payment_method: typeof paymentIntent.payment_method === 'string' ? paymentIntent.payment_method : paymentIntent.payment_method?.type || 'stripe'
      })
      .eq('id', qrPayment.id)

    // Process the payment and create order
    const result = await processQRPayment({
      qrPaymentId: qrPayment.id,
      paymentMethod: typeof paymentIntent.payment_method === 'string' ? paymentIntent.payment_method : paymentIntent.payment_method?.type || 'stripe',
      transactionId: paymentIntent.id,
      amount: qrPayment.amount,
      currency: qrPayment.currency,
      customerInfo: qrPayment.customer_info
    })

    if (result.success) {
      console.log('🎉 Order created successfully:', result.orderId)
    } else {
      console.error('❌ Failed to create order:', result.error)
    }

  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('❌ Payment failed:', paymentIntent.id)

    // Find and update QR payment record
    const { data: qrPayment, error: qrError } = await supabase
      .from('qr_payments')
      .select('*')
      .eq('transaction_id', paymentIntent.id)
      .single()

    if (qrError || !qrPayment) {
      console.error('QR payment not found for Payment Intent:', paymentIntent.id)
      return
    }

    // Update QR payment status
    await supabase
      .from('qr_payments')
      .update({
        status: 'failed',
        notes: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`
      })
      .eq('id', qrPayment.id)

  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handlePaymentCancellation(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('🚫 Payment canceled:', paymentIntent.id)

    // Find and update QR payment record
    const { data: qrPayment, error: qrError } = await supabase
      .from('qr_payments')
      .select('*')
      .eq('transaction_id', paymentIntent.id)
      .single()

    if (qrError || !qrPayment) {
      console.error('QR payment not found for Payment Intent:', paymentIntent.id)
      return
    }

    // Update QR payment status
    await supabase
      .from('qr_payments')
      .update({
        status: 'cancelled',
        notes: 'Payment was canceled by user'
      })
      .eq('id', qrPayment.id)

  } catch (error) {
    console.error('Error handling payment cancellation:', error)
  }
}
