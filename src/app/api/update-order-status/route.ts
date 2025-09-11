import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseAdminClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createServerSupabaseAdminClient()
    
    if (!supabaseAdmin) {
      console.error('❌ Supabase admin client not available')
      return NextResponse.json({ error: 'Service unavailable' }, { status: 500 })
    }

    const { orderId, status, paymentIntentId, paymentStatus } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Update order status
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .update({
        status: status,
        payment_intent_id: paymentIntentId,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (orderError) {
      console.error('Error updating order:', orderError)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // Create payment record if payment was successful
    if (status === 'paid' && paymentStatus === 'succeeded') {
      console.log('💰 Creating payment record for order:', orderId)
      console.log('💰 Payment details:', {
        orderId: orderId,
        amount: order.total,
        paymentMethod: 'stripe',
        transactionId: paymentIntentId
      })
      
      const { error: paymentError } = await supabaseAdmin
        .from('payments')
        .insert({
          order_id: orderId,
          amount: order.total,
          payment_method: 'stripe',
          payment_status: 'completed',
          transaction_id: paymentIntentId,
          payment_date: new Date().toISOString()
        })

      if (paymentError) {
        console.error('Error creating payment record:', paymentError)
      } else {
        console.log(`✅ Payment record created for order ${orderId}`)
      }
    }

    return NextResponse.json({
      success: true,
      order: order
    })

  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
