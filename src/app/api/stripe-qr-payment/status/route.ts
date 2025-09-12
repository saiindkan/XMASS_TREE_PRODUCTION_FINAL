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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const qrPaymentId = searchParams.get('qrPaymentId')

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
      // Update status to expired
      await supabase
        .from('qr_payments')
        .update({ status: 'expired' })
        .eq('id', qrPaymentId)

      return NextResponse.json({
        success: true,
        status: 'expired',
        message: 'Payment session has expired'
      })
    }

    // Get Stripe Payment Intent status
    if (qrPayment.transaction_id) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(qrPayment.transaction_id)
        
        // Update QR payment status based on Stripe status
        let newStatus = qrPayment.status
        if (paymentIntent.status === 'succeeded' && qrPayment.status === 'pending') {
          newStatus = 'completed'
          await supabase
            .from('qr_payments')
            .update({ 
              status: 'completed',
              completed_at: new Date().toISOString(),
              payment_method: typeof paymentIntent.payment_method === 'string' ? paymentIntent.payment_method : paymentIntent.payment_method?.type || 'stripe'
            })
            .eq('id', qrPaymentId)
        } else if (paymentIntent.status === 'canceled' && qrPayment.status === 'pending') {
          newStatus = 'cancelled'
          await supabase
            .from('qr_payments')
            .update({ status: 'cancelled' })
            .eq('id', qrPaymentId)
        } else if (paymentIntent.status === 'requires_payment_method' && qrPayment.status === 'pending') {
          newStatus = 'pending'
        }

        return NextResponse.json({
          success: true,
          status: newStatus,
          stripeStatus: paymentIntent.status,
          amount: qrPayment.amount / 100,
          currency: qrPayment.currency,
          paymentMethod: typeof paymentIntent.payment_method === 'string' ? paymentIntent.payment_method : paymentIntent.payment_method?.type,
          lastUpdated: new Date().toISOString()
        })

      } catch (stripeError) {
        console.error('Stripe payment intent retrieval error:', stripeError)
        // Return current status if Stripe call fails
        return NextResponse.json({
          success: true,
          status: qrPayment.status,
          amount: qrPayment.amount / 100,
          currency: qrPayment.currency,
          lastUpdated: qrPayment.updated_at
        })
      }
    }

    // Return current status if no Stripe transaction ID
    return NextResponse.json({
      success: true,
      status: qrPayment.status,
      amount: qrPayment.amount / 100,
      currency: qrPayment.currency,
      lastUpdated: qrPayment.updated_at
    })

  } catch (error) {
    console.error('QR payment status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
