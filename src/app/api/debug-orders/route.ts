import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get the latest 3 orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: 'No orders found' })
    }

    return NextResponse.json({
      orders: orders.map(order => ({
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        total: order.total,
        items: order.items,
        customer_info: order.customer_info,
        created_at: order.created_at
      }))
    })

  } catch (error) {
    console.error('Debug orders error:', error)
    return NextResponse.json(
      { error: 'Failed to debug orders' },
      { status: 500 }
    )
  }
}
