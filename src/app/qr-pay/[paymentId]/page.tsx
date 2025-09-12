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
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending')

  useEffect(() => {
    if (paymentId) {
      fetchPaymentData()
    }
  }, [paymentId])

  const fetchPaymentData = async () => {
    try {
      const response = await fetch(`/api/stripe-qr-payment/status?qrPaymentId=${paymentId}`)
      const data = await response.json()
      
      if (data.success) {
        // Fetch full payment data
        const fullResponse = await fetch(`/api/debug-qr-payments`)
        const fullData = await fullResponse.json()
        const payment = fullData.qrPayments.find((p: any) => p.id === paymentId)
        
        if (payment) {
          setPaymentData(payment)
          setPaymentStatus(data.status === 'completed' ? 'completed' : 'pending')
        } else {
          setError('Payment not found')
        }
      } else {
        setError('Failed to load payment data')
      }
    } catch (err) {
      setError('Error loading payment data')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (paymentMethod: 'card' | 'mobile') => {
    setProcessing(true)
    
    try {
      const response = await fetch('/api/stripe-qr-payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrPaymentId: paymentId,
          paymentMethod: paymentMethod === 'mobile' ? 'test_payment' : 'card_payment'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setPaymentStatus('completed')
        // Redirect to success page after 3 seconds
        setTimeout(() => {
          window.location.href = '/order-confirmation'
        }, 3000)
      } else {
        setError(result.error || 'Payment failed')
        setPaymentStatus('failed')
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
          <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
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
            {paymentData.customer_info.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span className="text-emerald-600">${(paymentData.amount / 100).toFixed(2)}</span>
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
