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

  // Only show card payment - no mobile payments
  useEffect(() => {
    const methods = ['card']
    setAvailableMethods(methods)
    setSelectedMethod('card')
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Method</h3>
      </div>

      <div className="flex justify-center">
        {availableMethods.map((method) => {
          const info = getPaymentMethodInfo(method)
          const isSelected = selectedMethod === method
          
          return (
            <button
              key={method}
              onClick={() => handlePayment(method)}
              disabled={isProcessing}
              className={`
                relative flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all duration-200 min-w-[200px]
                ${isSelected 
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-105'
                }
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${info.color}
              `}
              title={info.name}
            >
              <div className="flex items-center justify-center mb-4">
                {info.icon}
              </div>
              <span className="text-lg font-semibold">{info.name}</span>
                
              {isSelected && isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-xl">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          )
        })}
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
