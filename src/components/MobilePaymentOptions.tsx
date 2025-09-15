'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Smartphone, Zap, DollarSign } from 'lucide-react'

interface MobilePaymentOptionsProps {
  total: number
  customerInfo: any
  onPaymentSuccess: (paymentMethod: string, paymentData: any) => void
  onPaymentError: (error: string) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export default function MobilePaymentOptions({
  total,
  customerInfo,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing
}: MobilePaymentOptionsProps) {
  const [availableMethods, setAvailableMethods] = useState<string[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // No payment methods available
  useEffect(() => {
    const methods: string[] = []
    setAvailableMethods(methods)
    setSelectedMethod('')
    setIsLoading(false)
  }, [])

  const handlePayment = async (method: string) => {
    setIsProcessing(true)
    setSelectedMethod(method)
    
    try {
      let paymentData: any = null
      
      switch (method) {
        case 'card':
          paymentData = await handleCardPayment()
          break
        default:
          throw new Error('Unsupported payment method')
      }
      
      onPaymentSuccess(method, paymentData)
    } catch (error: any) {
      console.error('Payment error:', error)
      onPaymentError(error.message || 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardPayment = async () => {
    // Card payment - this will be handled by the parent component
    return { method: 'card', redirect: true }
  }



  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case 'card':
        return {
          name: 'Credit/Debit Card',
          icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
          ),
          description: 'Card',
          color: 'bg-blue-600 text-white hover:bg-blue-700'
        }
      default:
        return {
          name: 'Payment',
          icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
          ),
          description: 'Payment',
          color: 'bg-gray-700 text-white hover:bg-gray-800'
        }
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Methods</h3>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center space-x-3 text-gray-600">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">No payment methods available</span>
        </div>
        <p className="text-sm text-gray-500 mt-3 text-center">
          Payment options are currently unavailable. Please contact support for assistance.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 mt-1">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Fast & Secure</h4>
            <p className="text-sm text-blue-800">
              All payment methods are processed securely through Stripe. 
              Your payment information is never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Total: <span className="font-semibold text-lg text-emerald-600">${total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  )
}
