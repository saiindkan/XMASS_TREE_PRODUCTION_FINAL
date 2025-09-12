import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get the latest QR payments
    const { data: qrPayments, error } = await supabase
      .from('qr_payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error fetching QR payments:', error)
      return NextResponse.json({ error: 'Failed to fetch QR payments' }, { status: 500 })
    }

    if (!qrPayments || qrPayments.length === 0) {
      return NextResponse.json({ message: 'No QR payments found' })
    }

    return NextResponse.json({
      qrPayments: qrPayments.map(qrPayment => ({
        id: qrPayment.id,
        amount: qrPayment.amount,
        currency: qrPayment.currency,
        status: qrPayment.status,
        customer_info: qrPayment.customer_info,
        created_at: qrPayment.created_at,
        completed_at: qrPayment.completed_at
      }))
    })

  } catch (error) {
    console.error('Debug QR payments error:', error)
    return NextResponse.json(
      { error: 'Failed to debug QR payments' },
      { status: 500 }
    )
  }
}
