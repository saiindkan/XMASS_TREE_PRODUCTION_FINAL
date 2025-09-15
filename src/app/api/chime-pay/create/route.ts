import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, customerInfo, returnUrl, cancelUrl } = await request.json()

    if (!amount || !customerInfo) {
      return NextResponse.json(
        { error: 'Amount and customer info are required' },
        { status: 400 }
      )
    }

    // Create Stripe Checkout Session for Chime payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Christmas Tree Order',
              description: `Order for ${customerInfo.name}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: customerInfo.email,
      metadata: {
        payment_method: 'chime',
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone || '',
        order_type: 'mobile_payment'
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
    })

    return NextResponse.json({
      success: true,
      paymentUrl: session.url,
      sessionId: session.id
    })

  } catch (error) {
    console.error('Chime payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create Chime payment' },
      { status: 500 }
    )
  }
}
