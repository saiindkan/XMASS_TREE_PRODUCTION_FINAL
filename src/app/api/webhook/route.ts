import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseAdminClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  console.log('🔔 Webhook received:', new Date().toISOString())
  
  const supabaseAdmin = createServerSupabaseAdminClient()
  
  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not available')
    return NextResponse.json({ error: 'Service unavailable' }, { status: 500 })
  }
  
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log('✅ Webhook signature verified, event type:', event.type)
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata.orderId
        
        console.log('💳 Payment succeeded for order:', orderId)
        console.log('💰 Payment amount:', paymentIntent.amount / 100)

        if (orderId) {
          // Update order status to paid
          const { error: orderError } = await supabaseAdmin
            .from('orders')
            .update({
              status: 'paid',
              payment_intent_id: paymentIntent.id,
              payment_status: 'succeeded',
              updated_at: new Date().toISOString()
            })
            .eq('id', orderId)

          if (orderError) {
            console.error('Error updating order:', orderError)
          } else {
            console.log(`Order ${orderId} marked as paid`)
          }

          // Create payment record
          console.log('💰 Creating payment record via webhook for order:', orderId)
          console.log('💰 Payment details:', {
            orderId: orderId,
            amount: paymentIntent.amount / 100,
            paymentMethod: 'stripe',
            transactionId: paymentIntent.id
          })
          
          const { error: paymentError } = await supabaseAdmin
            .from('payments')
            .insert({
              order_id: orderId,
              amount: paymentIntent.amount / 100, // Convert from cents
              payment_method: 'stripe',
              payment_status: 'completed',
              transaction_id: paymentIntent.id,
              payment_date: new Date().toISOString()
            })

          if (paymentError) {
            console.error('Error creating payment record:', paymentError)
          } else {
            console.log(`✅ Payment record created for order ${orderId}`)
          }

          // Send order confirmation notifications
          try {
            console.log('📧 Sending order confirmation notifications via webhook')
            
            // Fetch order details for email notification (removed customer_addresses join due to missing relationship)
            const { data: orderForEmail, error: orderEmailError } = await supabaseAdmin
              .from('orders')
              .select(`
                *,
                customers!inner(
                  first_name,
                  last_name,
                  email,
                  phone,
                  company
                )
              `)
              .eq('id', orderId)
              .single()

            if (orderEmailError || !orderForEmail) {
              console.error('❌ Error fetching order for email:', orderEmailError)
            } else {
              // Import email functions directly
              const { generateOrderConfirmationEmail, generateOrderConfirmationText } = await import('@/lib/email-templates')
              const { sendEmail } = await import('@/lib/email')

              // Transform order data for email template
              const emailOrderData = {
                ...orderForEmail,
                customer_name: `${orderForEmail.customers.first_name} ${orderForEmail.customers.last_name}`,
                customer_email: orderForEmail.customers.email,
                customer_phone: orderForEmail.customers.phone,
                billing_address: orderForEmail.billing_address ? {
                  street: orderForEmail.billing_address.street || orderForEmail.billing_address.address_line_1 || 'Address not available',
                  city: orderForEmail.billing_address.city || 'City not available',
                  state: orderForEmail.billing_address.state || 'State not available',
                  zip_code: orderForEmail.billing_address.zip_code || orderForEmail.billing_address.postal_code || 'ZIP not available',
                  country: orderForEmail.billing_address.country || 'US'
                } : {
                  street: 'Address not available',
                  city: 'City not available',
                  state: 'State not available',
                  zip_code: 'ZIP not available',
                  country: 'US'
                },
                items: Array.isArray(orderForEmail.items) ? orderForEmail.items.map((item: any) => ({
                  product_name: item.name,
                  quantity: item.quantity,
                  total: item.price * item.quantity
                })) : []
              }

              // Generate and send email
              const emailHtml = generateOrderConfirmationEmail(emailOrderData)
              const emailText = generateOrderConfirmationText(emailOrderData)

              console.log('📧 Sending order confirmation email to:', emailOrderData.customer_email)
              
              const emailResult = await sendEmail({
                to: emailOrderData.customer_email,
                subject: '🎄 Order Confirmation - Luxury Christmas Trees & Decor',
                html: emailHtml,
                text: emailText
              })

              console.log('✅ Email sent successfully:', emailResult.messageId)
            }
          } catch (notificationError) {
            console.error('❌ Error sending webhook notifications:', notificationError)
            console.error('❌ Error details:', notificationError.message)
          }
        }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        const failedOrderId = failedPayment.metadata.orderId

        if (failedOrderId) {
          // Update order status to failed
          const { error: orderError } = await supabaseAdmin
            .from('orders')
            .update({
              status: 'failed',
              payment_intent_id: failedPayment.id,
              payment_status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('id', failedOrderId)

          if (orderError) {
            console.error('Error updating failed order:', orderError)
          } else {
            console.log(`Order ${failedOrderId} marked as failed`)
          }

          // Create failed payment record
          const { error: paymentError } = await supabaseAdmin
            .from('payments')
            .insert({
              order_id: failedOrderId,
              amount: failedPayment.amount / 100, // Convert from cents
              payment_method: 'stripe',
              payment_status: 'failed',
              transaction_id: failedPayment.id,
              payment_date: new Date().toISOString()
            })

          if (paymentError) {
            console.error('Error creating failed payment record:', paymentError)
          } else {
            console.log(`Failed payment record created for order ${failedOrderId}`)
          }
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
