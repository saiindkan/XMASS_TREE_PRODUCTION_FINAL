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
    
    console.log('📝 Update order status request:', {
      orderId,
      status,
      paymentIntentId,
      paymentStatus
    })

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
      console.error('❌ Error updating order:', orderError)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }
    
    console.log('✅ Order updated successfully:', {
      orderId: order.id,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentIntentId: order.payment_intent_id
    })

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

      // Send order confirmation email
      try {
        console.log('📧 Sending order confirmation email...')
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL}/api/send-order-notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: orderId })
        })
        
        if (emailResponse.ok) {
          const emailResult = await emailResponse.json()
          console.log('✅ Order confirmation email sent:', emailResult.message)
        } else {
          console.error('❌ Failed to send order confirmation email')
        }
      } catch (emailError) {
        console.error('❌ Error sending order confirmation email:', emailError)
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
