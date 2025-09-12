import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getLocalhostConfig, generateQRCodeData } from '@/lib/localhost-handler'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, customerInfo } = body

    // Validate required fields
    if (!amount || !currency || !customerInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate a unique QR payment ID
    const qrPaymentId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create QR payment record in database
    const { data: qrPayment, error: qrError } = await supabase
      .from('qr_payments')
      .insert({
        id: qrPaymentId,
        amount: amount,
        currency: currency,
        status: 'pending',
        customer_info: customerInfo,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
      })
      .select()
      .single()

    if (qrError) {
      console.error('QR payment creation error:', qrError)
      return NextResponse.json(
        { error: 'Failed to create QR payment' },
        { status: 500 }
      )
    }

    // Get localhost configuration
    const config = getLocalhostConfig()
    
    // Generate QR code data based on environment
    const qrData = generateQRCodeData(qrPaymentId, amount, currency, config)

    // Return QR payment data
    return NextResponse.json({
      success: true,
      qrPaymentId: qrPaymentId,
      qrData: qrData,
      amount: amount,
      currency: currency,
      expiresAt: qrPayment.expires_at
    })

  } catch (error) {
    console.error('QR payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
