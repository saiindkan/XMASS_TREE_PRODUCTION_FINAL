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

    // Check if Apple Pay merchant ID is configured
    if (!process.env.APPLE_PAY_MERCHANT_ID) {
      console.log('Apple Pay merchant ID not configured, using fallback validation')
      // Return a mock validation response for development/testing
      return NextResponse.json({
        merchantSessionIdentifier: 'mock-session-' + Date.now(),
        domainName: process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '') || 'localhost:3000',
        displayName: 'Christmas Tree Shop',
        merchantIdentifier: 'mock-merchant-id',
        initiative: 'web',
        initiativeContext: process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '') || 'localhost:3000'
      })
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

    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('text/html')) {
      console.error('Apple Pay validation returned HTML instead of JSON')
      // Return mock validation for development
      return NextResponse.json({
        merchantSessionIdentifier: 'fallback-session-' + Date.now(),
        domainName: process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '') || 'localhost:3000',
        displayName: 'Christmas Tree Shop',
        merchantIdentifier: 'fallback-merchant-id',
        initiative: 'web',
        initiativeContext: process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '') || 'localhost:3000'
      })
    }

    const validationData = await response.json()
    
    return NextResponse.json(validationData)

  } catch (error) {
    console.error('Apple Pay validation error:', error)
    
    // Return a fallback validation response for development
    return NextResponse.json({
      merchantSessionIdentifier: 'error-fallback-session-' + Date.now(),
      domainName: process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '') || 'localhost:3000',
      displayName: 'Christmas Tree Shop',
      merchantIdentifier: 'error-fallback-merchant-id',
      initiative: 'web',
      initiativeContext: process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '') || 'localhost:3000'
    })
  }
}
