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

// Use the main webhook secret if QR webhook secret is not available
const webhookSecret = process.env.STRIPE_QR_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET!

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('🔔 Stripe Checkout Webhook received at:', new Date().toISOString())
  
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('❌ Missing Stripe signature')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log('✅ Webhook signature verified, event type:', event.type)
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('🔔 Stripe Checkout Webhook received:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('✅ Checkout session completed:', session.id)
        console.log('💰 Session amount total:', session.amount_total)
        console.log('💳 Payment intent:', session.payment_intent)
        console.log('📧 Customer email:', session.customer_email)
        console.log('📋 Session metadata:', session.metadata)
        
        // Get QR payment ID from metadata
        const qrPaymentId = session.metadata?.qr_payment_id
        
        if (qrPaymentId) {
          console.log('🔍 Found QR payment ID:', qrPaymentId)
          
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
          console.log('📦 QR payment items:', JSON.stringify(qrPayment.customer_info?.items, null, 2))
          console.log('💰 QR payment amount:', qrPayment.amount)

          // Update QR payment status
          const { error: updateError } = await supabase
            .from('qr_payments')
            .update({
              status: 'completed',
              payment_method: 'stripe_checkout',
              checkout_session_id: session.id,
              completed_at: new Date().toISOString(),
              notes: `Stripe Checkout completed: ${session.id}`
            })
            .eq('id', qrPaymentId)

          if (updateError) {
            console.error('❌ Failed to update QR payment status:', updateError)
          } else {
            console.log('✅ QR payment status updated to completed')
          }

          // Process the QR payment to create order with full customer info
          try {
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
          } catch (processError) {
            console.error('❌ Error processing QR payment:', processError)
          }
        } else {
          console.log('⚠️ No QR payment ID found in session metadata')
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
