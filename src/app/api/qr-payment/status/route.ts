import { NextRequest, NextResponse } from 'next/server'
import { getQRPaymentStatus } from '@/lib/qr-payment-handler'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const qrPaymentId = searchParams.get('qrPaymentId')

    if (!qrPaymentId) {
      return NextResponse.json(
        { error: 'QR payment ID is required' },
        { status: 400 }
      )
    }

    // Get QR payment status using the universal handler
    const result = await getQRPaymentStatus(qrPaymentId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'QR payment not found' ? 404 : 500 }
      )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('QR payment status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
