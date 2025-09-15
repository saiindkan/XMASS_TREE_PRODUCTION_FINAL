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

  // Detect available payment methods
  useEffect(() => {
    const methods: string[] = []
    
    // Check for Apple Pay (iOS Safari)
    if (typeof window !== 'undefined' && (window as any).ApplePaySession) {
      try {
        if ((window as any).ApplePaySession.canMakePayments()) {
          methods.push('apple_pay')
        }
      } catch (error) {
        console.log('Apple Pay not available:', error)
      }
    }
    
    // Check for Google Pay with retry mechanism and timeout
    let retryCount = 0
    const maxRetries = 5
    
    const checkGooglePay = () => {
      if (typeof window !== 'undefined' && (window as any).google?.payments?.api) {
        try {
          const googlePayClient = new (window as any).google.payments.api.PaymentsClient({
            environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST'
          })
          
          googlePayClient.isReadyToPay({
            allowedPaymentMethods: [{
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA']
              }
            }]
          }).then((response: any) => {
            if (response.result) {
              if (!methods.includes('google_pay')) {
                methods.push('google_pay')
                setAvailableMethods([...methods])
              }
            }
          }).catch((error: any) => {
            console.log('Google Pay not available:', error)
          })
        } catch (error) {
          console.log('Google Pay not available:', error)
        }
      } else if (retryCount < maxRetries) {
        // Retry after a short delay if Google Pay API isn't loaded yet
        retryCount++
        setTimeout(checkGooglePay, 1000)
      } else {
        console.log('Google Pay API failed to load after maximum retries')
      }
    }
    
    // Start checking for Google Pay
    checkGooglePay()
    
    // Only show methods that are actually available
    // Don't force show methods that aren't supported
    if (methods.length === 0) {
      // If no mobile payment methods are available, show a fallback message
      console.log('No mobile payment methods available')
    }
    
    setAvailableMethods(methods)
    setSelectedMethod(methods[0] || 'apple_pay')
    setIsLoading(false)
  }, [])

  const handlePayment = async (method: string) => {
    setIsProcessing(true)
    setSelectedMethod(method)
    
    try {
      let paymentData: any = null
      
      switch (method) {
        case 'apple_pay':
          paymentData = await handleApplePay()
          break
        case 'google_pay':
          paymentData = await handleGooglePay()
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

  const handleApplePay = async () => {
    // Check if Apple Pay is available
    if (typeof window === 'undefined' || !(window as any).ApplePaySession) {
      throw new Error('Apple Pay is not available on this device')
    }

    // Apple Pay implementation
    const paymentRequest = {
      countryCode: 'US',
      currencyCode: 'USD',
      supportedNetworks: ['visa', 'mastercard', 'amex'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label: 'Christmas Tree Shop',
        amount: total.toString()
      }
    }

    const session = new (window as any).ApplePaySession(3, paymentRequest)
    
    return new Promise((resolve, reject) => {
      session.onvalidatemerchant = async (event: any) => {
        try {
          const response = await fetch('/api/apple-pay/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ validationURL: event.validationURL })
          })
          const data = await response.json()
          session.completeMerchantValidation(data)
        } catch (error) {
          reject(error)
        }
      }

      session.onpaymentauthorized = async (event: any) => {
        try {
          const response = await fetch('/api/apple-pay/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              payment: event.payment,
              customerInfo,
              total
            })
          })
          const data = await response.json()
          
          if (data.success) {
            session.completePayment(0) // Success
            resolve(data)
          } else {
            session.completePayment(1) // Failure
            reject(new Error(data.error))
          }
        } catch (error) {
          session.completePayment(1)
          reject(error)
        }
      }

      session.begin()
    })
  }

  const handleGooglePay = async () => {
    // Check if Google Pay API is available
    if (typeof window === 'undefined' || !(window as any).google?.payments?.api) {
      throw new Error('Google Pay is not available on this device. Please try Apple Pay or use a supported browser.')
    }

    // Google Pay implementation
    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA']
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'stripe',
            gatewayMerchantId: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          }
        }
      }],
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: total.toString(),
        currencyCode: 'USD'
      },
      merchantInfo: {
        merchantId: 'christmas-tree-shop',
        merchantName: 'Christmas Tree Shop'
      }
    }

    try {
      const paymentsClient = new (window as any).google.payments.api.PaymentsClient({
        environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST'
      })

      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest)
      
      const response = await fetch('/api/google-pay/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentData,
          customerInfo,
          total
        })
      })
      
      return await response.json()
    } catch (error) {
      console.error('Google Pay error:', error)
      throw new Error('Google Pay payment failed. Please try again.')
    }
  }


  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case 'apple_pay':
        return {
          name: 'Apple Pay',
          icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          ),
          description: 'Apple Pay',
          color: 'bg-black text-white hover:bg-gray-800'
        }
      case 'google_pay':
        return {
          name: 'Google Pay',
          icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          ),
          description: 'Google Pay',
          color: 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Payment Methods...</h3>
        </div>
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // If no mobile payment methods are available, show fallback
  if (availableMethods.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Payment Options</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-yellow-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Mobile payments not available</span>
            </div>
            <p className="text-sm text-yellow-700 mt-2 text-center">
              Apple Pay and Google Pay are not supported on this device or browser. 
              Please use the credit card payment option below.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Payment Method</h3>
      </div>

      <div className="flex justify-center gap-6">
        {availableMethods.map((method) => {
          const info = getPaymentMethodInfo(method)
          const isSelected = selectedMethod === method
          
          return (
            <button
              key={method}
              onClick={() => handlePayment(method)}
              disabled={isProcessing}
              className={`
                relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 min-w-[140px]
                ${isSelected 
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-105'
                }
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${info.color}
              `}
              title={info.name}
            >
              <div className="flex items-center justify-center mb-3">
                {info.icon}
              </div>
              <span className="text-sm font-semibold">{info.name}</span>
                
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
