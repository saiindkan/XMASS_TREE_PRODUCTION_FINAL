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
      console.log('🔧 SMTP Configuration Check:')
      console.log('  - SMTP_HOST:', process.env.SMTP_HOST ? '✅ Set' : '❌ Missing')
      console.log('  - SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ Missing')
      console.log('  - SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Missing')
      console.log('  - SMTP_PORT:', process.env.SMTP_PORT || '587 (default)')
      console.log('  - SMTP_SECURE:', process.env.SMTP_SECURE || 'false (default)')
      return { 
        success: false, 
        message: 'SMTP not configured. Please set up SMTP environment variables.',
        emailContent: emailHtml.substring(0, 1000),
        smtpConfig: {
          host: !!process.env.SMTP_HOST,
          user: !!process.env.SMTP_USER,
          pass: !!process.env.SMTP_PASS,
          port: process.env.SMTP_PORT || '587',
          secure: process.env.SMTP_SECURE || 'false'
        }
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

    // Fetch order details directly (no need for customer join since order has all customer data)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Error fetching order:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log('📧 Sending email notification for order:', orderId)
    console.log('📧 Order customer_email:', order.customer_email)
    console.log('📧 Order customer_name:', order.customer_name)
    console.log('📧 Order customer_phone:', order.customer_phone)

    // Transform order data for email template
    // Use order's customer data directly (no need for customers table join)
    
    // Debug: Log the actual order structure
    console.log('🔍 Order billing_address structure:', JSON.stringify(order.billing_address, null, 2));
    console.log('🔍 Order customer_info structure:', JSON.stringify(order.customer_info, null, 2));
    
    // Handle billing address - check if it's a JSON object or individual fields
    let billingAddress = {
      street: 'Address not available',
      city: 'City not available', 
      state: 'State not available',
      zip_code: 'ZIP not available',
      country: 'US'
    };
    
    if (order.billing_address) {
      // If billing_address is a JSON object
      if (typeof order.billing_address === 'object' && order.billing_address !== null) {
        // Check if street field contains the actual address data
        if (order.billing_address.street && typeof order.billing_address.street === 'object') {
          // Street field contains the address object
          billingAddress = {
            street: order.billing_address.street.line1 || order.billing_address.street.address_line_1 || 'Address not available',
            city: order.billing_address.street.city || 'City not available',
            state: order.billing_address.street.state || 'State not available',
            zip_code: order.billing_address.street.postal_code || order.billing_address.street.zip_code || 'ZIP not available',
            country: order.billing_address.street.country || order.billing_address.country || 'US'
          };
        } else {
          // Normal address structure
          billingAddress = {
            street: order.billing_address.address_line_1 || order.billing_address.street || order.billing_address.line1 || 'Address not available',
            city: order.billing_address.city || 'City not available',
            state: order.billing_address.state || 'State not available', 
            zip_code: order.billing_address.postal_code || order.billing_address.zip_code || order.billing_address.postalCode || 'ZIP not available',
            country: order.billing_address.country || 'US'
          };
        }
      }
    } else if (order.customer_info?.address) {
      // Fallback to customer_info address
      billingAddress = {
        street: order.customer_info.address.line1 || order.customer_info.address.street || 'Address not available',
        city: order.customer_info.address.city || 'City not available',
        state: order.customer_info.address.state || 'State not available',
        zip_code: order.customer_info.address.postal_code || order.customer_info.address.zip_code || 'ZIP not available',
        country: order.customer_info.address.country || 'US'
      };
    }
    
    // Also check for individual address fields in the order
    if (order.billing_address_line1 || order.billing_city) {
      billingAddress = {
        street: order.billing_address_line1 || 'Address not available',
        city: order.billing_city || 'City not available',
        state: order.billing_state || 'State not available',
        zip_code: order.billing_postal_code || 'ZIP not available',
        country: order.billing_country || 'US'
      };
    }
    
    const emailOrderData = {
      ...order,
      customer_name: order.customer_name || order.customer_info?.name || 'Customer',
      customer_email: order.customer_email || order.customer_info?.email || 'customer@example.com',
      customer_phone: order.customer_phone || order.customer_info?.phone || '',
      billing_address: billingAddress,
      items: Array.isArray(order.items) ? order.items.map((item: any) => ({
        product_name: item.product_name || item.name,
        quantity: item.quantity,
        total: item.total || (item.price * item.quantity)
      })) : []
    }
    
    console.log('📧 Final email order data billing_address:', JSON.stringify(emailOrderData.billing_address, null, 2));

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
