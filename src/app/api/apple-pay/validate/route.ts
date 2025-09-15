import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { validationURL } = await request.json()

    if (!validationURL) {
      return NextResponse.json(
        { error: 'Validation URL is required' },
        { status: 400 }
      )
    }

    // Validate the Apple Pay session
    const response = await fetch(validationURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchantIdentifier: process.env.APPLE_PAY_MERCHANT_ID,
        domainName: process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '') || 'localhost:3000',
        displayName: 'Christmas Tree Shop'
      })
    })

    const validationData = await response.json()
    
    return NextResponse.json(validationData)

  } catch (error) {
    console.error('Apple Pay validation error:', error)
    return NextResponse.json(
      { error: 'Apple Pay validation failed' },
      { status: 500 }
    )
  }
}
