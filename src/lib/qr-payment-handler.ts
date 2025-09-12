// Universal QR Payment Handler
// Handles QR code payments from both localhost and production environments

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface QRPaymentData {
  type: string
  paymentId: string
  amount: number
  currency: string
  merchant: string
  timestamp: number
  paymentUrl: string
  statusUrl: string
  environment: 'development' | 'production'
  paymentData: {
    amount: number
    currency: string
    merchant: string
    transactionId: string
    timestamp: number
  }
  testMode?: boolean
  localhost?: any
  production?: any
}

export interface PaymentCompletionRequest {
  qrPaymentId: string
  paymentMethod: string
  transactionId: string
  amount?: number
  currency?: string
  customerInfo?: any
}

// Process QR code payment from any environment
export async function processQRPayment(request: PaymentCompletionRequest) {
  try {
    const { qrPaymentId, paymentMethod, transactionId, amount, currency, customerInfo } = request

    // Get QR payment record
    const { data: qrPayment, error: fetchError } = await supabase
      .from('qr_payments')
      .select('*')
      .eq('id', qrPaymentId)
      .single()

    if (fetchError) {
      console.error('QR payment fetch error:', fetchError)
      return {
        success: false,
        error: 'QR payment not found'
      }
    }

    // Check if payment is still pending or completed (for test payments)
    if (qrPayment.status !== 'pending' && qrPayment.status !== 'completed') {
      return {
        success: false,
        error: 'Payment is no longer pending'
      }
    }

    // If payment is already completed, we can still create the order
    if (qrPayment.status === 'completed') {
      console.log('🔍 Debug - Payment already completed, proceeding with order creation')
    }

    // Check if payment has expired
    const now = new Date()
    const expiresAt = new Date(qrPayment.expires_at)
    
    if (now > expiresAt) {
      // Update status to expired
      await supabase
        .from('qr_payments')
        .update({ status: 'expired' })
        .eq('id', qrPaymentId)
      
      return {
        success: false,
        error: 'Payment has expired'
      }
    }

    // Update QR payment status to completed
    const { error: updateError } = await supabase
      .from('qr_payments')
      .update({
        status: 'completed',
        payment_method: paymentMethod,
        transaction_id: transactionId,
        completed_at: new Date().toISOString()
      })
      .eq('id', qrPaymentId)

    if (updateError) {
      console.error('QR payment update error:', updateError)
      return {
        success: false,
        error: 'Failed to update payment status'
      }
    }

    // Create order record
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    // Ensure customer record exists for authenticated users
    let customerId = null
    if (qrPayment.customer_info?.user_id) {
      try {
        console.log('🔍 Creating customer for user_id:', qrPayment.customer_info.user_id)
        
        // First, check if customer already exists
        const { data: existingCustomer, error: checkError } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', qrPayment.customer_info.user_id)
          .single()
        
        if (existingCustomer) {
          customerId = existingCustomer.id
          console.log('✅ Found existing customer:', customerId)
        } else {
          // Create new customer record
          const { data: newCustomer, error: createError } = await supabase
            .from('customers')
            .insert({
              user_id: qrPayment.customer_info.user_id,
              first_name: qrPayment.customer_info.name?.split(' ')[0] || 'Customer',
              last_name: qrPayment.customer_info.name?.split(' ')[1] || 'User',
              email: qrPayment.customer_info.email || 'user@example.com',
              phone: qrPayment.customer_info.phone
            })
            .select()
            .single()
          
          if (createError) {
            console.error('❌ Customer creation error:', createError)
            // Continue without customer_id if there's an error
          } else {
            customerId = newCustomer.id
            console.log('✅ Created new customer:', customerId)
          }
        }
      } catch (error) {
        console.error('❌ Customer creation failed:', error)
        // Continue without customer_id if there's an error
      }
    } else {
      console.log('⚠️ No user_id provided, creating guest order')
    }
    
    // Use the original amount that was passed (which already includes tax)
    // The frontend calculates the total with tax and passes it to the QR payment
    const items = qrPayment.customer_info?.items || []
    const originalTotal = qrPayment.amount / 100 // Convert from cents to dollars
    
    // Calculate subtotal from items (without tax)
    const subtotal = items.reduce((sum: number, item: any) => {
      const price = item.product?.price || item.price || 0
      const quantity = item.quantity || 1
      return sum + (price * quantity)
    }, 0)
    
    // Calculate tax amount (difference between total and subtotal)
    const taxAmount = Math.round((originalTotal - subtotal) * 100) / 100
    const shippingAmount = 0
    const discountAmount = 0
    const total = originalTotal // Use the original total that includes tax

    console.log('💰 QR Payment Tax Calculation:', {
      subtotal: subtotal,
      taxAmount: taxAmount,
      shippingAmount: shippingAmount,
      discountAmount: discountAmount,
      total: total,
      originalAmountCents: qrPayment.amount,
      originalAmountDollars: originalTotal,
      note: 'Using original amount that already includes tax from frontend'
    })

    // Map payment method to user-friendly label
    const getPaymentMethodLabel = (method: string) => {
      switch (method) {
        case 'test_payment':
          return 'QR Payment'
        case 'apple_pay':
          return 'Apple Pay'
        case 'google_pay':
          return 'Google Pay'
        case 'card':
          return 'Card (QR)'
        default:
          return 'QR Payment'
      }
    }

    const paymentMethodLabel = getPaymentMethodLabel(paymentMethod)

    console.log('💳 Payment Method Mapping:', {
      originalMethod: paymentMethod,
      mappedLabel: paymentMethodLabel
    })

    // Prepare order data with fallbacks for missing columns
    const orderData: any = {
      order_number: orderNumber,
      user_id: qrPayment.customer_info?.user_id || null, // Allow null for guest orders
      customer_id: customerId, // Use the customer ID from the customers table
      customer_info: qrPayment.customer_info || {},
      items: items,
      subtotal: subtotal,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      discount_amount: discountAmount,
      total: total,
      currency: qrPayment.currency,
      status: 'paid',
      payment_method: paymentMethodLabel, // Use user-friendly label
      payment_reference: qrPaymentId,
      notes: `QR Payment completed via ${paymentMethod}`
    }

    // Debug: Log the items being stored
    console.log('🔍 Debug - Items being stored in order:', JSON.stringify(qrPayment.customer_info?.items, null, 2))
    console.log('🔍 Debug - Order data items field:', JSON.stringify(orderData.items, null, 2))

    // Keep user_id and customer_id even if null (for guest orders)
    // Only remove them if they're explicitly undefined
    if (orderData.user_id === undefined) {
      delete orderData.user_id
    }
    if (orderData.customer_id === undefined) {
      delete orderData.customer_id
    }
    
    console.log('🔍 Order data before creation:', {
      user_id: orderData.user_id,
      customer_id: orderData.customer_id,
      order_number: orderData.order_number
    })

    console.log('🔍 Debug - Attempting to create order with data:', JSON.stringify(orderData, null, 2))
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error('❌ Order creation error:', orderError)
      return {
        success: false,
        error: 'Failed to create order'
      }
    }

    console.log('✅ Order created successfully:', order.id, order.order_number)

    // Create payment transaction record (if table exists)
    try {
      const { error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          order_id: order.id,
          qr_payment_id: qrPaymentId, // Use qr_payment_id instead of stripe_payment_intent_id
          amount: qrPayment.amount, // Amount is already in cents from database
          currency: qrPayment.currency,
          status: 'succeeded',
          payment_method_id: transactionId,
          payment_method_type: paymentMethod
        })

      if (transactionError) {
        console.error('Payment transaction creation error:', transactionError)
        // Don't fail the request, just log the error
      }
    } catch (error) {
      console.error('Payment transaction table might not exist:', error)
      // Continue without creating transaction record
    }

    // Send order notification
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL}/api/send-order-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: orderNumber,
          customerEmail: qrPayment.customer_info?.email || '',
          customerPhone: qrPayment.customer_info?.phone || '',
          total: total, // Use calculated total with tax (in dollars)
          currency: qrPayment.currency,
          paymentMethod: paymentMethodLabel // Use the mapped payment method label
        })
      })
    } catch (notificationError) {
      console.error('Order notification error:', notificationError)
      // Don't fail the request, just log the error
    }

    return {
      success: true,
      orderId: order.id,
      orderNumber: orderNumber,
      status: 'completed',
      amount: total, // Use calculated total with tax (in dollars)
      currency: qrPayment.currency
    }

  } catch (error) {
    console.error('QR payment processing error:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

// Validate QR code data
export function validateQRCodeData(qrData: any): qrData is QRPaymentData {
  return (
    qrData &&
    typeof qrData === 'object' &&
    qrData.type === 'payment' &&
    typeof qrData.paymentId === 'string' &&
    typeof qrData.amount === 'number' &&
    typeof qrData.currency === 'string' &&
    typeof qrData.merchant === 'string' &&
    typeof qrData.timestamp === 'number' &&
    typeof qrData.paymentUrl === 'string' &&
    typeof qrData.statusUrl === 'string' &&
    typeof qrData.environment === 'string' &&
    qrData.paymentData &&
    typeof qrData.paymentData === 'object'
  )
}

// Get QR payment status
export async function getQRPaymentStatus(qrPaymentId: string) {
  try {
    const { data: qrPayment, error } = await supabase
      .from('qr_payments')
      .select('*')
      .eq('id', qrPaymentId)
      .single()

    if (error) {
      console.error('QR payment status error:', error)
      return {
        success: false,
        error: 'QR payment not found'
      }
    }

    // Check if payment has expired
    const now = new Date()
    const expiresAt = new Date(qrPayment.expires_at)
    
    if (now > expiresAt && qrPayment.status === 'pending') {
      // Update status to expired
      await supabase
        .from('qr_payments')
        .update({ status: 'expired' })
        .eq('id', qrPaymentId)
      
      qrPayment.status = 'expired'
    }

    return {
      success: true,
      status: qrPayment.status,
      amount: qrPayment.amount,
      currency: qrPayment.currency,
      createdAt: qrPayment.created_at,
      expiresAt: qrPayment.expires_at,
      completedAt: qrPayment.completed_at
    }

  } catch (error) {
    console.error('QR payment status error:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}
