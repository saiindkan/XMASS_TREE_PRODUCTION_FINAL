'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, XCircle, CreditCard, Smartphone, Loader2 } from 'lucide-react'

interface PaymentData {
  id: string
  amount: number
  currency: string
  status: string
  customer_info: {
    name: string
    email: string
    items: Array<{
      id: number
      name: string
      price: number
      quantity: number
      image: string
    }>
  }
  expires_at: string
}

export default function QRPaymentPage() {
  const params = useParams()
  const paymentId = params.paymentId as string
  
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed' | 'expired'>('pending')

  useEffect(() => {
    if (paymentId) {
      fetchPaymentData()
      
      // Set up periodic status checking for pending payments
      const interval = setInterval(() => {
        if (paymentStatus === 'pending') {
          fetchPaymentData()
        }
      }, 3000) // Check every 3 seconds
      
      return () => clearInterval(interval)
    }
  }, [paymentId, paymentStatus])

  const fetchPaymentData = async () => {
    try {
      console.log('🔍 Fetching QR payment data for:', paymentId)
      
      const response = await fetch(`/api/stripe-qr-payment/status?qrPaymentId=${paymentId}`)
      const data = await response.json()
      
      console.log('📋 QR payment status response:', data)
      
      if (data.success) {
        // Use the real-time status from the status API
        const realTimeStatus = data.status
        
        // Check if payment is expired
        if (realTimeStatus === 'expired') {
          console.log('⚠️ QR payment has expired')
          setPaymentStatus('expired')
          setError('This payment link has expired. Please create a new payment.')
          setLoading(false)
          return
        }
        
        // Fetch full payment data for display
        const fullResponse = await fetch(`/api/debug-qr-payments`)
        const fullData = await fullResponse.json()
        const payment = fullData.qrPayments.find((p: any) => p.id === paymentId)
        
        if (payment) {
          // Update the payment data with real-time status
          const updatedPayment = { ...payment, status: realTimeStatus }
          console.log('🔍 QR Payment data:', updatedPayment)
          console.log('🔍 Items data:', updatedPayment.customer_info?.items)
          console.log('🔍 Amount data:', updatedPayment.amount)
          setPaymentData(updatedPayment)
          
          // Set payment status based on REAL-TIME status from status API
          if (realTimeStatus === 'completed') {
            console.log('✅ Payment already completed, redirecting to success page')
            setPaymentStatus('completed')
            // Redirect to success page after a short delay
            setTimeout(() => {
              window.location.href = `/order-confirmation?qr_payment_id=${paymentId}`
            }, 2000)
          } else if (realTimeStatus === 'failed') {
            setPaymentStatus('failed')
          } else if (realTimeStatus === 'expired') {
            setPaymentStatus('expired')
          } else {
            setPaymentStatus('pending')
          }
        } else {
          setError('Payment not found')
        }
      } else {
        setError(data.error || 'Failed to load payment data')
      }
    } catch (err) {
      console.error('❌ Error loading payment data:', err)
      setError('Error loading payment data')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (paymentMethod: 'card' | 'mobile') => {
    setProcessing(true)
    
    try {
      if (paymentMethod === 'mobile') {
        // For mobile payments, redirect to Stripe's hosted payment page
        // which will handle Apple Pay, Google Pay, etc.
        const response = await fetch('/api/stripe-qr-payment/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            qrPaymentId: paymentId
          })
        })

        const result = await response.json()
        
        if (result.success && result.checkoutUrl) {
          // Redirect to Stripe's checkout page
          window.location.href = result.checkoutUrl
        } else {
          setError(result.error || 'Failed to create checkout session')
          setPaymentStatus('failed')
        }
      } else {
        // For card payments, use the existing process
        const response = await fetch('/api/stripe-qr-payment/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            qrPaymentId: paymentId,
            paymentMethod: 'card_payment'
          })
        })

        const result = await response.json()
        
        if (result.success) {
          console.log('✅ Card payment completed successfully')
          setPaymentStatus('completed')
          // Redirect to success page immediately
          setTimeout(() => {
            window.location.href = `/order-confirmation?qr_payment_id=${paymentId}`
          }, 1500)
        } else {
          console.error('❌ Card payment failed:', result.error)
          setError(result.error || 'Payment failed')
          setPaymentStatus('failed')
        }
      }
    } catch (err) {
      setError('Payment processing failed')
      setPaymentStatus('failed')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Payment...</h2>
          <p className="text-gray-600">Please wait while we load your payment details</p>
        </div>
      </div>
    )
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Payment not found'}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your payment has been processed successfully</p>
          <p className="text-sm text-gray-500 mb-6">Redirecting to order confirmation...</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = `/order-confirmation?qr_payment_id=${paymentId}`}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              View Order Confirmation
            </button>
            <button 
              onClick={() => window.location.href = '/orders'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to My Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-4">Your payment could not be processed</p>
          <p className="text-sm text-gray-500 mb-6">Please try again or contact support</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Link Expired</h2>
          <p className="text-gray-600 mb-4">This QR payment link is no longer active</p>
          <p className="text-sm text-gray-500 mb-6">QR payment links expire after 15 minutes for security</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/checkout'}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Create New Payment
            </button>
            <button 
              onClick={() => window.location.href = '/orders'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Orders
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Scan this QR code to pay for your Christmas tree order</p>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            {paymentData.customer_info.items.map((item, index) => {
              // Ensure price is properly formatted
              const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
              const itemTotal = itemPrice * (item.quantity || 1);
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image || '/placeholder-image.jpg'} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${itemPrice.toFixed(2)}</p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-gray-500">Total: ${itemTotal.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span className="text-emerald-600">
                ${typeof paymentData.amount === 'number' ? paymentData.amount.toFixed(2) : (parseFloat(paymentData.amount) || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Payment Method</h2>
          
          <div className="space-y-4">
            {/* Mobile Payment */}
            <button
              onClick={() => handlePayment('mobile')}
              disabled={processing}
              className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors disabled:opacity-50"
            >
              <Smartphone className="h-6 w-6 text-emerald-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Mobile Payment</p>
                <p className="text-sm text-gray-500">Apple Pay, Google Pay, Banking Apps</p>
              </div>
            </button>

            {/* Card Payment */}
            <button
              onClick={() => handlePayment('card')}
              disabled={processing}
              className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <CreditCard className="h-6 w-6 text-gray-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Card Payment</p>
                <p className="text-sm text-gray-500">Credit/Debit Card</p>
              </div>
            </button>
          </div>

          {processing && (
            <div className="mt-4 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mx-auto mb-2" />
              <p className="text-gray-600">Processing payment...</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            This payment page was opened by scanning a QR code. 
            Choose your preferred payment method above to complete your order.
          </p>
        </div>
      </div>
    </div>
  )
}
