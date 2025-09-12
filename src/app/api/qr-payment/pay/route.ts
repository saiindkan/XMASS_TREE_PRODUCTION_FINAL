import { NextRequest, NextResponse } from 'next/server'
import { processQRPayment } from '@/lib/qr-payment-handler'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrPaymentId, paymentMethod, transactionId, amount, currency, customerInfo } = body

    // Validate required fields
    if (!qrPaymentId || !paymentMethod || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Process the QR payment using the universal handler
    const result = await processQRPayment({
      qrPaymentId,
      paymentMethod,
      transactionId,
      amount,
      currency,
      customerInfo
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'QR payment not found' ? 404 : 400 }
      )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('QR payment completion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
