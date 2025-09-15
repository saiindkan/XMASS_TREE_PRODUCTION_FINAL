'use client'

import { useState, useEffect } from 'react'
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Shield, Truck, Lock, CheckCircle, AlertCircle, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
)

// Card validation utilities
const validateCardNumber = (cardNumber: string): { isValid: boolean; type: string } => {
  const cleaned = cardNumber.replace(/\s/g, '')
  
  // Luhn algorithm
  const luhnCheck = (num: string): boolean => {
    let sum = 0
    let isEven = false
    
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i])
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  }
  
  // Card type detection
  const getCardType = (num: string): string => {
    if (/^4/.test(num)) return 'visa'
    if (/^5[1-5]/.test(num)) return 'mastercard'
    if (/^3[47]/.test(num)) return 'amex'
    if (/^6/.test(num)) return 'discover'
    return 'unknown'
  }
  
  const type = getCardType(cleaned)
  
  return { isValid: luhnCheck(cleaned) && cleaned.length >= 13 && cleaned.length <= 19, type }
}

const validateCVV = (cvv: string, cardType: string): boolean => {
  const cleaned = cvv.replace(/\s/g, '')
  if (cardType === 'amex') {
    return /^\d{4}$/.test(cleaned)
  }
  return /^\d{3}$/.test(cleaned)
}

const validateExpiryDate = (expiryDate: string): boolean => {
  const [month, year] = expiryDate.split('/')
  const monthNum = parseInt(month)
  const yearNum = parseInt('20' + year)
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()
  
  if (monthNum < 1 || monthNum > 12) return false
  if (yearNum < currentYear) return false
  if (yearNum === currentYear && monthNum < currentMonth) return false
  
  return true
}

const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, '')
  const groups = cleaned.match(/.{1,4}/g) || []
  return groups.join(' ')
}

// Step 1: Customer Information Component
const CustomerInfoStep = ({ 
  formData, 
  setFormData, 
  errors, 
  setErrors, 
  onNext 
}: {
  formData: any
  setFormData: (data: any) => void
  errors: any
  setErrors: (errors: any) => void
  onNext: () => void
}) => {
  const validateForm = () => {
    const newErrors: any = {}
    
    // Required field validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Street address is required'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required'
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Information</h1>
        <p className="text-gray-600">Please provide your contact and billing details</p>
      </div>

      {/* Customer Information Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-emerald-600" />
              Personal Information
            </h3>
            
            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cardholderName}
                onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter your full name"
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.cardholderName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Billing Address */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-emerald-600" />
              Billing Address
            </h3>
            
            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter your street address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.address}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter your city"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.city}
                </p>
              )}
            </div>

            {/* State and ZIP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="State"
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.state}
                  </p>
                )}
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code <span className="text-red-500">*</span>
              </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="ZIP"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.zipCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 flex items-center"
          >
            Continue to Payment
            <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Step 2: Payment Method Component
const PaymentMethodStep = ({ 
  formData, 
  setFormData, 
  errors, 
  setErrors, 
  onBack, 
  onComplete,
  cart
}: {
  formData: any
  setFormData: (data: any) => void
  errors: any
  setErrors: (errors: any) => void
  onBack: () => void
  onComplete: () => void
  cart: any[]
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const { data: session } = useSession()
  const stripe = useStripe()
  const elements = useElements()



  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentError('')
    setErrors({})

    let responseData: any = null

    try {
      if (selectedPaymentMethod === 'card') {
        // Handle card payment
        if (!stripe || !elements) {
          setPaymentError('Stripe not loaded. Please refresh the page.')
          setIsProcessing(false)
          return
        }

        const cardElement = elements.getElement(CardElement)
        if (!cardElement) {
          setPaymentError('Card element not found.')
          setIsProcessing(false)
          return
        }

        // Create payment intent
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart, // Include cart items
            amount: Math.round(formData.total * 100), // Convert to cents
            currency: 'usd',
            customerInfo: {
              name: formData.cardholderName,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: 'US'
              }
            }
          })
        })

        responseData = await response.json()
        
        console.log('📥 Payment intent response:', responseData)
        
        if (!response.ok) {
          throw new Error(responseData.error || 'Payment intent creation failed')
        }
        
        const { client_secret } = responseData
        
        if (!client_secret) {
          throw new Error('No client secret received from server')
        }
        
        console.log('✅ Payment intent created, proceeding with confirmation...')

        // Confirm payment
        console.log('🔄 Confirming payment with Stripe...')
        const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.cardholderName,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: 'US'
              }
            }
          }
        })

        console.log('💳 Payment confirmation result:', { error, paymentIntent })

        if (error) {
          console.error('❌ Payment failed:', error)
          setPaymentError(error.message || 'Payment failed')
          setIsProcessing(false)
        } else {
          // Payment successful - update order status
          console.log('✅ Payment confirmed successfully!')
          console.log('📋 Payment intent details:', paymentIntent)
          
          // Update order status to paid
          try {
            console.log('🔄 Updating order status...')
            const updateResponse = await fetch('/api/update-order-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: responseData.orderId,
                status: 'paid',
                paymentStatus: 'succeeded',
                paymentIntentId: paymentIntent?.id || responseData.paymentIntentId || 'unknown'
              })
            })
            
            const updateResult = await updateResponse.json()
            console.log('📝 Update response:', updateResult)
            
            if (updateResponse.ok) {
              console.log('✅ Order status updated to paid successfully!')
            } else {
              console.error('❌ Failed to update order status:', updateResult)
            }
          } catch (updateError) {
            console.error('❌ Error updating order status:', updateError)
          }
          
          onComplete()
        }
      } else {
        // Mobile payment methods are handled by the MobilePaymentOptions component
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError('Payment processing failed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Method</h1>
        <p className="text-gray-600">Choose your preferred payment method</p>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Card Payment Only */}
        <div className="max-w-md mx-auto">
          <div className="border-2 border-emerald-500 bg-emerald-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 text-emerald-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Credit/Debit Card</h3>
            </div>
            <p className="text-gray-600 mb-4">Pay securely with your credit or debit card</p>
            
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg p-4">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Error Display */}
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-600 font-medium">Payment Error</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{paymentError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Information
          </button>
          
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Complete Payment
                <CheckCircle className="h-5 w-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Success Component
const SuccessStep = ({ 
  onContinueShopping 
}: {
  onContinueShopping: () => void
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your order! You will receive confirmation notifications via email and SMS shortly.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Notifications Sent</span>
          </div>
          <div className="text-sm text-emerald-700 space-y-1">
            <p>📧 Email confirmation sent to your email address</p>
            <p>📱 SMS confirmation sent to your phone number</p>
            <p>📋 Order details and tracking information included</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders?success=true"
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
          >
            View Your Orders Now
          </Link>
          <button
            onClick={onContinueShopping}
            className="border-2 border-emerald-500 text-emerald-700 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Checkout Component
const CheckoutForm = () => {
  const { cart, getCartTotal, clearCart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState<'info' | 'payment' | 'success'>('info')
  // Calculate total with tax (8% tax rate)
  const calculateTotalWithTax = () => {
    const subtotal = getCartTotal()
    const taxRate = 0.08
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100
    return subtotal + taxAmount
  }

  const [formData, setFormData] = useState({
    cardholderName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    total: calculateTotalWithTax()
  })
  const [errors, setErrors] = useState<any>({})

  // Update total when cart changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      total: calculateTotalWithTax()
    }))
  }, [cart, getCartTotal])

  // Redirect if cart is empty (but not if we're on success step)
  if (cart.length === 0 && currentStep !== 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <Link
            href="/products"
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-orange-100 px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const handleStepComplete = () => {
    setCurrentStep('success')
    clearCart()
  }

  const handleContinueShopping = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            href="/cart"
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Step {currentStep === 'info' ? '1' : '2'} of 2</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep === 'info' ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'info' ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Information</span>
            </div>
            <div className={`w-16 h-1 ${currentStep === 'payment' || currentStep === 'success' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep === 'payment' || currentStep === 'success' ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'payment' || currentStep === 'success' ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'info' && (
            <CustomerInfoStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              onNext={() => setCurrentStep('payment')}
            />
          )}
          
          {currentStep === 'payment' && (
            <PaymentMethodStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              onBack={() => setCurrentStep('info')}
              onComplete={handleStepComplete}
              cart={cart}
            />
          )}
          
          {currentStep === 'success' && (
            <SuccessStep onContinueShopping={handleContinueShopping} />
          )}
        </div>
      </div>
    </div>
  )
}

// Main Checkout Page Component
const CheckoutPage = () => {
  const { cart } = useCart()
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to continue</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to proceed with checkout.</p>
          <Link
            href="/auth/signin"
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-orange-100 px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}

export default CheckoutPage