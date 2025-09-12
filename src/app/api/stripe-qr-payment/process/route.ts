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
    const { 
      qrPaymentId, 
      paymentMethod, 
      paymentMethodId,
      mobileAppData 
    } = body

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

    // Check if already completed - for test payments, we can still process
    if (qrPayment.status === 'completed' && paymentMethod !== 'test_payment') {
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

    // Handle different payment methods
    let confirmParams: any = {
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`
    }

    // For test payments, simulate success and create order
    if (paymentMethod === 'test_payment') {
      // Simulate successful payment for testing
      await supabase
        .from('qr_payments')
        .update({
          status: 'completed',
          payment_method: 'test_payment',
          notes: 'Test payment simulation'
        })
        .eq('id', qrPaymentId)

      // Import and call the order creation process
      const { processQRPayment } = await import('@/lib/qr-payment-handler')
      
      const result = await processQRPayment({
        qrPaymentId: qrPaymentId,
        paymentMethod: 'test_payment',
        transactionId: paymentIntent.id,
        amount: qrPayment.amount,
        currency: qrPayment.currency,
        customerInfo: qrPayment.customer_info
      })

      if (result.success) {
        return NextResponse.json({
          success: true,
          status: 'succeeded',
          paymentIntentId: paymentIntent.id,
          orderId: result.orderId,
          message: 'Test payment completed successfully and order created'
        })
      } else {
        return NextResponse.json({
          success: false,
          error: result.error || 'Failed to create order'
        })
      }
    }

    // For real payments, use actual payment method
    if (paymentMethodId) {
      confirmParams.payment_method = paymentMethodId
    }

    // Add mobile app specific data
    if (mobileAppData) {
      confirmParams.mobile_app_data = mobileAppData
    }

    // Confirm the payment intent
    const confirmedPayment = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      confirmParams
    )

    // Update QR payment status
    await supabase
      .from('qr_payments')
      .update({
        status: confirmedPayment.status === 'succeeded' ? 'completed' : 'pending',
        payment_method: paymentMethod || (typeof confirmedPayment.payment_method === 'string' ? confirmedPayment.payment_method : confirmedPayment.payment_method?.type),
        notes: `Mobile payment processed via ${paymentMethod || 'mobile app'}`
      })
      .eq('id', qrPaymentId)

    return NextResponse.json({
      success: true,
      status: confirmedPayment.status,
      paymentIntentId: confirmedPayment.id,
      clientSecret: confirmedPayment.client_secret,
      nextAction: confirmedPayment.next_action
    })

  } catch (error) {
    console.error('Mobile payment processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process mobile payment' },
      { status: 500 }
    )
  }
}

// Handle GET requests for mobile app deep linking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const qrPaymentId = searchParams.get('qrPaymentId')
    const paymentMethod = searchParams.get('method')

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

    // Return payment information for mobile apps
    return NextResponse.json({
      success: true,
      qrPaymentId: qrPaymentId,
      amount: qrPayment.amount / 100,
      currency: qrPayment.currency,
      merchant: 'Christmas Tree Shop',
      status: qrPayment.status,
      expiresAt: qrPayment.expires_at,
      supportedMethods: ['apple_pay', 'google_pay', 'card'],
      paymentUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stripe-qr-payment/process`
    })

  } catch (error) {
    console.error('Mobile payment info error:', error)
    return NextResponse.json(
      { error: 'Failed to get payment info' },
      { status: 500 }
    )
  }
}
