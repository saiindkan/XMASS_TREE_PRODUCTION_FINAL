import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseAdminClient } from '@/lib/supabase'
import { generateOrderConfirmationEmail, generateOrderConfirmationText } from '@/lib/email-templates'
import { sendEmail } from '@/lib/email'

// Email service using the existing email infrastructure
async function sendEmailNotification(orderData: any) {
  try {
    // Generate beautiful email content using our template
    const emailHtml = generateOrderConfirmationEmail(orderData)
    const emailText = generateOrderConfirmationText(orderData)

    console.log('📧 Sending order confirmation email to:', orderData.customer_email)
    console.log('📧 Email Subject: 🎄 Order Confirmation - Luxury Christmas Trees & Decor')
    console.log('📧 Email Content Preview:', emailText.substring(0, 200) + '...')
    
    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('⚠️ SMTP not configured - email would be sent to:', orderData.customer_email)
      console.log('📧 Email HTML Preview:', emailHtml.substring(0, 500) + '...')
      return { 
        success: true, 
        message: 'Email prepared but SMTP not configured. Please set up SMTP environment variables.',
        emailContent: emailHtml.substring(0, 1000)
      }
    }
    
    // Send email using the existing email infrastructure
    const emailResult = await sendEmail({
      to: orderData.customer_email,
      subject: '🎄 Order Confirmation - Luxury Christmas Trees & Decor',
      html: emailHtml,
      text: emailText
    })

    console.log('✅ Email sent successfully:', emailResult.messageId)
    return { success: true, message: 'Email sent successfully', messageId: emailResult.messageId }
  } catch (error) {
    console.error('Error sending email notification:', error)
    return { success: false, message: error.message }
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createServerSupabaseAdminClient()
    
    if (!supabaseAdmin) {
      console.error('❌ Supabase admin client not available')
      return NextResponse.json({ error: 'Service unavailable' }, { status: 500 })
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Fetch order details with customer information (removed customer_addresses join due to missing relationship)
    const { data: order, error: orderError } = await supabaseAdmin
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

    if (orderError || !order) {
      console.error('Error fetching order:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log('📧 Sending email notification for order:', orderId)

    // Transform order data for email template
    const emailOrderData = {
      ...order,
      customer_name: `${order.customers.first_name} ${order.customers.last_name}`,
      customer_email: order.customers.email,
      customer_phone: order.customers.phone,
      billing_address: order.billing_address ? {
        street: order.billing_address.street || order.billing_address.address_line_1 || 'Address not available',
        city: order.billing_address.city || 'City not available',
        state: order.billing_address.state || 'State not available',
        zip_code: order.billing_address.zip_code || order.billing_address.postal_code || 'ZIP not available',
        country: order.billing_address.country || 'US'
      } : {
        street: 'Address not available',
        city: 'City not available',
        state: 'State not available',
        zip_code: 'ZIP not available',
        country: 'US'
      },
      items: Array.isArray(order.items) ? order.items.map((item: any) => ({
        product_name: item.name,
        quantity: item.quantity,
        total: item.price * item.quantity
      })) : []
    }

    // Send email notification
    const emailResult = await sendEmailNotification(emailOrderData)

    return NextResponse.json({
      success: true,
      email: emailResult,
      order: {
        id: order.id,
        order_number: order.order_number,
        customer_email: order.customer_email,
        total: order.total
      }
    })

  } catch (error) {
    console.error('Error sending order notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
