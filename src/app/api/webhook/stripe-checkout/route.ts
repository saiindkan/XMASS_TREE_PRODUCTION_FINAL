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

const webhookSecret = process.env.STRIPE_QR_WEBHOOK_SECRET!

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('🔔 Stripe Checkout Webhook received:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('✅ Checkout session completed:', session.id)
        
        // Get QR payment ID from metadata
        const qrPaymentId = session.metadata?.qr_payment_id
        
        if (qrPaymentId) {
          // First, get the QR payment data
          const { data: qrPayment, error: qrError } = await supabase
            .from('qr_payments')
            .select('*')
            .eq('id', qrPaymentId)
            .single()

          if (qrError || !qrPayment) {
            console.error('❌ QR payment not found:', qrError)
            return NextResponse.json({ received: true })
          }

          console.log('🔍 Processing QR payment:', qrPaymentId)
          console.log('📦 QR payment items:', qrPayment.customer_info?.items)

          // Update QR payment status
          await supabase
            .from('qr_payments')
            .update({
              status: 'completed',
              payment_method: 'stripe_checkout',
              checkout_session_id: session.id,
              completed_at: new Date().toISOString(),
              notes: `Stripe Checkout completed: ${session.id}`
            })
            .eq('id', qrPaymentId)

          // Process the QR payment to create order with full customer info
          const { processQRPayment } = await import('@/lib/qr-payment-handler')
          
          const result = await processQRPayment({
            qrPaymentId: qrPaymentId,
            paymentMethod: 'stripe_checkout',
            transactionId: session.payment_intent as string,
            amount: session.amount_total || qrPayment.amount,
            currency: session.currency || qrPayment.currency,
            customerInfo: qrPayment.customer_info // Use full customer info from QR payment
          })

          if (result.success) {
            console.log('✅ Order created successfully:', result.orderId)
            console.log('📋 Order details:', result)
          } else {
            console.error('❌ Failed to create order:', result.error)
          }
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('⏰ Checkout session expired:', session.id)
        
        // Get QR payment ID from metadata
        const qrPaymentId = session.metadata?.qr_payment_id
        
        if (qrPaymentId) {
          // Update QR payment status to expired
          await supabase
            .from('qr_payments')
            .update({
              status: 'expired',
              notes: `Stripe Checkout expired: ${session.id}`
            })
            .eq('id', qrPaymentId)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
