import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    // Check if order exists for this QR payment
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_reference', qrPaymentId)

    // Check if customer exists
    let customer = null
    if (qrPayment.customer_info?.user_id) {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', qrPayment.customer_info.user_id)
        .single()
      
      customer = customerData
    }

    return NextResponse.json({
      success: true,
      qrPayment: qrPayment,
      orders: orders || [],
      customer: customer,
      hasOrder: orders && orders.length > 0,
      hasCustomer: !!customer,
      debug: {
        qrPaymentStatus: qrPayment.status,
        qrPaymentItems: qrPayment.customer_info?.items,
        qrPaymentCustomerInfo: qrPayment.customer_info,
        ordersCount: orders?.length || 0,
        customerExists: !!customer
      }
    })

  } catch (error) {
    console.error('Error checking QR payment status:', error)
    return NextResponse.json(
      { error: 'Failed to check QR payment status' },
      { status: 500 }
    )
  }
}
