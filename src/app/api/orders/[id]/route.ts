import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { status, stripePaymentIntentId, paidAt } = await request.json();

    const supabase = createSupabaseServerClient();

    // Verify the order belongs to the user
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (fetchError || !existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order
    const updateData: any = {};
    if (status) updateData.status = status;
    if (stripePaymentIntentId) updateData.stripe_payment_intent_id = stripePaymentIntentId;
    if (paidAt) updateData.paid_at = paidAt;

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order: updatedOrder,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const supabase = createSupabaseServerClient();

    // Get order with all related data (removed payment_transactions due to missing relationship)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        customer_addresses (*)
      `)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
