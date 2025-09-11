import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentIntentId = searchParams.get('payment_intent_id');
  const orderId = searchParams.get('order_id');

  if (!paymentIntentId && !orderId) {
    return NextResponse.json(
      { error: 'Missing payment_intent_id or order_id' },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();

  try {
    let query = supabase.from('orders').select('*');

    if (orderId) {
      query = query.eq('id', orderId);
    } else if (paymentIntentId) {
      // Try both new and old field names
      query = query.or(`payment_intent_id.eq.${paymentIntentId},stripe_payment_intent_id.eq.${paymentIntentId}`);
    }

    const { data: order, error } = await query.single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Return payment status information
    return NextResponse.json({
      order_id: order.id,
      payment_status: order.payment_status,
      order_status: order.order_status,
      status: order.status, // Old field for backward compatibility
      payment_intent_id: order.payment_intent_id || order.stripe_payment_intent_id,
      payment_confirmed_at: order.payment_confirmed_at,
      payment_failed_at: order.payment_failed_at,
      payment_failure_reason: order.payment_failure_reason,
      is_paid: order.payment_status === 'succeeded' || order.status === 'paid',
      created_at: order.created_at,
      updated_at: order.updated_at
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
