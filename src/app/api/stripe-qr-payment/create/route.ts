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
    const { amount, currency, customerInfo } = body

    if (!amount || !customerInfo) {
      return NextResponse.json(
        { error: 'Amount and customer info are required' },
        { status: 400 }
      )
    }

    // Create Stripe Payment Intent with QR code support
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: {
        customer_email: customerInfo.email,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone || '',
        order_type: 'qr_payment'
      },
      description: `QR Payment - ${customerInfo.name}`,
      receipt_email: customerInfo.email,
    })

    // Create QR payment record in database
    const qrPaymentId = `stripe_qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const { data: qrPayment, error: qrError } = await supabase
      .from('qr_payments')
      .insert({
        id: qrPaymentId,
        amount: Math.round(amount * 100), // Convert to cents for database storage
        currency: currency || 'usd',
        status: 'pending',
        customer_info: customerInfo,
        payment_method: 'stripe_qr',
        transaction_id: paymentIntent.id,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        notes: `Stripe Payment Intent: ${paymentIntent.id}`
      })
      .select()
      .single()

    // Debug: Log the created QR payment
    console.log('🔍 Debug - Created QR payment:', JSON.stringify(qrPayment, null, 2))

    if (qrError) {
      console.error('QR payment creation error:', qrError)
      return NextResponse.json(
        { error: 'Failed to create QR payment record' },
        { status: 500 }
      )
    }

    // Generate QR code data for mobile payment apps
    const qrData = {
      type: 'payment',
      paymentId: qrPaymentId,
      stripePaymentIntentId: paymentIntent.id,
      amount: amount,
      currency: currency || 'usd',
      merchant: 'Christmas Tree Shop',
      timestamp: Date.now(),
      paymentUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stripe-qr-payment/process`,
      statusUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stripe-qr-payment/status?qrPaymentId=${qrPaymentId}`,
      webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhook/stripe-qr`,
      supportedMethods: ['apple_pay', 'google_pay', 'card', 'link'],
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }

    return NextResponse.json({
      success: true,
      qrPaymentId: qrPaymentId,
      stripePaymentIntentId: paymentIntent.id,
      qrData: qrData,
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      currency: currency || 'usd',
      expiresAt: qrPayment.expires_at,
      statusUrl: qrData.statusUrl
    })

  } catch (error) {
    console.error('Stripe QR payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe QR payment' },
      { status: 500 }
    )
  }
}
