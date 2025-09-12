import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrPaymentId } = body

    if (!qrPaymentId) {
      return NextResponse.json(
        { error: 'QR Payment ID is required' },
        { status: 400 }
      )
    }

    // Get QR payment data
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

    console.log('🔍 Debug - QR Payment found:', qrPayment)
    console.log('📦 Items:', qrPayment.customer_info?.items)

    // Import and call the order creation process
    const { processQRPayment } = await import('@/lib/qr-payment-handler')
    
    const result = await processQRPayment({
      qrPaymentId: qrPaymentId,
      paymentMethod: 'stripe_checkout',
      transactionId: qrPayment.transaction_id,
      amount: qrPayment.amount,
      currency: qrPayment.currency,
      customerInfo: qrPayment.customer_info
    })

    if (result.success) {
      // Get the created order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', result.orderId)
        .single()

      return NextResponse.json({
        success: true,
        message: 'Order created successfully',
        orderId: result.orderId,
        order: order,
        qrPayment: qrPayment
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        qrPayment: qrPayment
      })
    }

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
