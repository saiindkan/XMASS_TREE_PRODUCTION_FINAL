'use client'

import { useState, useEffect } from 'react'
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
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
  
  const isValid = cleaned.length >= 13 && cleaned.length <= 19 && luhnCheck(cleaned)
  const type = getCardType(cleaned)
  
  return { isValid, type }
}

const validateCVV = (cvv: string, cardType: string): boolean => {
  const cleaned = cvv.replace(/\s/g, '')
  if (cardType === 'amex') {
    return /^\d{4}$/.test(cleaned)
  }
  return /^\d{3}$/.test(cleaned)
}

const validateExpiry = (expiry: string): boolean => {
  const [month, year] = expiry.split('/')
  if (!month || !year) return false
  
  const monthNum = parseInt(month)
  const yearNum = parseInt('20' + year)
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  
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

// Payment Form Component
const PaymentForm = () => {
  const { cart, getCartTotal, clearCart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [redirectCountdown, setRedirectCountdown] = useState(5)
  const [autoRedirect, setAutoRedirect] = useState(true)
  
  // Auto-redirect to orders page after successful payment
  useEffect(() => {
    if (isSuccess && autoRedirect && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isSuccess && autoRedirect && redirectCountdown === 0) {
      router.push('/orders?success=true')
    }
  }, [isSuccess, autoRedirect, redirectCountdown, router])
  
  // Form state - pre-fill with user data if available
  const [formData, setFormData] = useState({
    cardholderName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  
  // Calculate total with test product logic
  const totalPrice = getCartTotal()
  const totalItems = cart.length
  
  // Check if cart contains only test products
  const testProductIds = [5] // TEST PRODUCT ID
  const hasOnlyTestProducts = cart.every(item => testProductIds.includes(item.id))
  const hasTestProducts = cart.some(item => testProductIds.includes(item.id))
  const hasRegularProducts = cart.some(item => !testProductIds.includes(item.id))
  
  // Apply pricing logic
  let subtotal = totalPrice
  let shipping = 0 // Free shipping for all orders
  let tax = 0
  let finalTotal = 0
  
  if (hasOnlyTestProducts) {
    // Test products only - charge original price but no shipping/tax
    subtotal = totalPrice
    shipping = 0
    tax = 0
    finalTotal = subtotal + shipping + tax
  } else if (hasTestProducts && hasRegularProducts) {
    // Mixed cart - test products: original price, no tax; regular products: normal pricing
    const testItemsTotal = cart
      .filter(item => testProductIds.includes(item.id))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    const regularItemsTotal = cart
      .filter(item => !testProductIds.includes(item.id))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    subtotal = testItemsTotal + regularItemsTotal
    shipping = 0
    tax = regularItemsTotal * 0.08 // Tax only on regular products
    finalTotal = subtotal + shipping + tax
  } else {
    // Regular products only - normal pricing
    subtotal = totalPrice
    shipping = 0
    tax = subtotal * 0.08
    finalTotal = subtotal + shipping + tax
  }

  // Log client-side calculation for verification
  console.log('🛒 Client-Side Amount Calculation:')
  console.log('  Cart Items:', cart.length)
  console.log('  Has Only Test Products:', hasOnlyTestProducts)
  console.log('  Has Mixed Products:', hasTestProducts && hasRegularProducts)
  console.log('  Subtotal:', subtotal)
  console.log('  Shipping:', shipping)
  console.log('  Tax (8%):', tax)
  console.log('  Final Total:', finalTotal)

  // Update form data when user changes
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        cardholderName: session.user.name || prev.cardholderName,
        email: session.user.email || prev.email
      }))
    }
  }, [session])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Real-time validation
    const trimmedValue = value.trim()
    let fieldError = ''
    
    switch (field) {
      case 'cardholderName':
        if (trimmedValue && trimmedValue.length < 2) {
          fieldError = 'Cardholder name must be at least 2 characters'
        } else if (trimmedValue && trimmedValue.length > 50) {
          fieldError = 'Cardholder name must be less than 50 characters'
        }
        break
        
      case 'email':
        if (trimmedValue) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          if (!emailRegex.test(trimmedValue)) {
            fieldError = 'Please enter a valid email address (e.g., user@example.com)'
          } else if (trimmedValue.length > 254) {
            fieldError = 'Email address is too long'
          }
        }
        break
        
      case 'phone':
        if (trimmedValue) {
          const cleanedPhone = trimmedValue.replace(/[\s\-\(\)\.]/g, '')
          if (cleanedPhone.length < 10) {
            fieldError = 'Phone number must be at least 10 digits'
          }
        }
        break
        
      case 'address':
        if (trimmedValue && trimmedValue.length < 5) {
          fieldError = 'Street address must be at least 5 characters'
        } else if (trimmedValue && trimmedValue.length > 100) {
          fieldError = 'Street address must be less than 100 characters'
        }
        break
        
      case 'city':
        if (trimmedValue && trimmedValue.length < 2) {
          fieldError = 'City name must be at least 2 characters'
        } else if (trimmedValue && trimmedValue.length > 50) {
          fieldError = 'City name must be less than 50 characters'
        }
        break
        
      case 'state':
        if (trimmedValue && trimmedValue.length < 2) {
          fieldError = 'State must be at least 2 characters'
        } else if (trimmedValue && trimmedValue.length > 30) {
          fieldError = 'State must be less than 30 characters'
        }
        break
        
      case 'zipCode':
        if (trimmedValue && trimmedValue.length < 5) {
          fieldError = 'ZIP code must be at least 5 digits'
        }
        break
    }
    
    setErrors(prev => ({ ...prev, [field]: fieldError }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Cardholder Name Validation
    const cardholderName = formData.cardholderName.trim()
    if (!cardholderName) {
      newErrors.cardholderName = 'Cardholder name is required'
    } else if (cardholderName.length < 2) {
      newErrors.cardholderName = 'Cardholder name must be at least 2 characters'
    } else if (cardholderName.length > 50) {
      newErrors.cardholderName = 'Cardholder name must be less than 50 characters'
    }
    
    // Card Element Validation
    const cardElement = elements?.getElement(CardElement)
    if (!cardElement) {
      newErrors.payment = 'Card information is required'
    } else {
      // We'll validate the card element during payment processing
      // The CardElement will show validation errors automatically
      // For now, we just check if the element exists
    }
    
    // Email Validation
    const email = formData.email.trim()
    if (!email) {
      newErrors.email = 'Email address is required'
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address (e.g., user@example.com)'
      } else if (email.length > 254) {
        newErrors.email = 'Email address is too long'
      }
    }
    
    // Phone Validation
    const phone = formData.phone.trim()
    if (!phone) {
      newErrors.phone = 'Phone number is required'
    } else {
      const cleanedPhone = phone.replace(/[\s\-\(\)\.]/g, '')
      if (cleanedPhone.length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits'
      }
    }
    
    // Address Validation
    const address = formData.address.trim()
    if (!address) {
      newErrors.address = 'Street address is required'
    } else if (address.length < 5) {
      newErrors.address = 'Street address must be at least 5 characters'
    } else if (address.length > 100) {
      newErrors.address = 'Street address must be less than 100 characters'
    }
    
    // City Validation
    const city = formData.city.trim()
    if (!city) {
      newErrors.city = 'City is required'
    } else if (city.length < 2) {
      newErrors.city = 'City name must be at least 2 characters'
    } else if (city.length > 50) {
      newErrors.city = 'City name must be less than 50 characters'
    }
    
    // State Validation
    const state = formData.state.trim()
    if (!state) {
      newErrors.state = 'State is required'
    } else if (state.length < 2) {
      newErrors.state = 'State must be at least 2 characters'
    } else if (state.length > 30) {
      newErrors.state = 'State must be less than 30 characters'
    }
    
    // ZIP Code Validation
    const zipCode = formData.zipCode.trim()
    if (!zipCode) {
      newErrors.zipCode = 'ZIP code is required'
    } else if (zipCode.length < 5) {
      newErrors.zipCode = 'ZIP code must be at least 5 digits'
    }
    
    // Country Validation (if not US)
    if (formData.country && formData.country !== 'US') {
      // Add country-specific validation if needed
    }
    
    // Remove empty error messages
    const cleanErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([key, value]) => value && value.trim() !== '')
    )
    
    setErrors(cleanErrors)
    console.log('Validation result - cleanErrors:', cleanErrors)
    console.log('Validation result - has errors:', Object.keys(cleanErrors).length > 0)
    return Object.keys(cleanErrors).length === 0
  }

  const handleTryAgain = async () => {
    try {
      // Clear any existing errors
      setErrors({})
      setIsProcessing(false)
      
      // Sign out the user
      await signOut({ 
        callbackUrl: '/auth/signin',
        redirect: true 
      })
    } catch (error) {
      console.error('Error during sign out:', error)
      // Fallback redirect
      window.location.href = '/auth/signin'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      return
    }
    
    // Debug: Log current errors
    console.log('Current errors:', errors)
    console.log('Errors object keys:', Object.keys(errors))
    console.log('Non-empty errors:', Object.keys(errors).filter(key => errors[key] && errors[key].trim() !== ''))
    
    if (!validateForm()) {
      console.log('Form validation failed')
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            product: {
              id: item.id,
              name: item.name,
              price: item.price,
              image_url: item.img
            },
            quantity: item.quantity
          })),
          customerInfo: formData,
          clientTotal: finalTotal // Send client-calculated total for validation
        }),
      })
      
      const { clientSecret, orderId } = await response.json()
      
      if (!clientSecret) {
        throw new Error('Failed to create payment intent')
      }
      
      // Confirm payment with Stripe using CardElement
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: formData.cardholderName,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
              country: formData.country,
            },
          },
        },
      })
      
      if (error) {
        console.error('Payment failed:', error)
        
        // Enhanced error handling for different card validation issues
        let errorMessage = error.message || 'Payment failed'
        
        if (error.type === 'card_error') {
          switch (error.code) {
            case 'card_declined':
              errorMessage = 'Your card was declined. Please try a different card.'
              break
            case 'expired_card':
              errorMessage = 'Your card has expired. Please use a different card.'
              break
            case 'incorrect_cvc':
              errorMessage = 'The security code (CVC) is incorrect. Please check and try again.'
              break
            case 'incorrect_number':
              errorMessage = 'The card number is incorrect. Please check and try again.'
              break
            case 'incorrect_zip':
              errorMessage = 'The ZIP code is incorrect. Please check and try again.'
              break
            case 'invalid_cvc':
              errorMessage = 'The security code (CVC) is invalid. Please check and try again.'
              break
            case 'invalid_expiry_month':
              errorMessage = 'The expiration month is invalid. Please check and try again.'
              break
            case 'invalid_expiry_year':
              errorMessage = 'The expiration year is invalid. Please check and try again.'
              break
            case 'invalid_number':
              errorMessage = 'The card number is invalid. Please check and try again.'
              break
            case 'processing_error':
              errorMessage = 'An error occurred while processing your card. Please try again.'
              break
            default:
              errorMessage = `Card Error: ${error.message}`
          }
        } else if (error.type === 'validation_error') {
          errorMessage = `Validation Error: ${error.message}`
        } else if (error.type === 'authentication_error') {
          errorMessage = 'Authentication failed. Please try again or contact support.'
        } else if (error.type === 'api_error') {
          errorMessage = 'A server error occurred. Please try again in a few moments.'
        } else if (error.type === 'rate_limit_error') {
          errorMessage = 'Too many requests. Please wait a moment and try again.'
        } else if (error.type === 'invalid_request_error') {
          errorMessage = 'Invalid payment request. Please check your information and try again.'
        }
        
        setErrors({ payment: errorMessage })
        setIsProcessing(false)
      } else if (paymentIntent.status === 'succeeded') {
        setIsProcessing(false)
        setIsSuccess(true)
        
        // Update order status immediately as fallback
        try {
          console.log('🔄 Attempting to update order status for orderId:', orderId)
          
          // Small delay to ensure order is fully created
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const updateResponse = await fetch('/api/update-order-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: orderId,
              status: 'paid',
              paymentIntentId: paymentIntent.id,
              paymentStatus: 'succeeded'
            }),
          })
          
          if (updateResponse.ok) {
            console.log('✅ Order status updated successfully')
            const result = await updateResponse.json()
            console.log('📋 Update response:', result)
            
            // Send order confirmation notifications
            try {
              console.log('📧 Sending order confirmation notifications')
              const notificationResponse = await fetch('/api/send-order-notification', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId: orderId
                }),
              })
              
              if (notificationResponse.ok) {
                const notificationResult = await notificationResponse.json()
                console.log('✅ Notifications sent successfully:', notificationResult)
              } else {
                console.error('❌ Failed to send notifications')
                const errorText = await notificationResponse.text()
                console.error('📋 Notification error response:', errorText)
              }
            } catch (notificationError) {
              console.error('❌ Error sending notifications:', notificationError)
            }
          } else {
            console.error('❌ Failed to update order status')
            const errorText = await updateResponse.text()
            console.error('📋 Error response:', errorText)
          }
        } catch (error) {
          console.error('❌ Error updating order status:', error)
        }
        
        // Clear cart after successful payment
        setTimeout(() => {
          clearCart()
        }, 2000)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setErrors({ payment: 'Payment processing failed. Please try again.' })
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
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

  if (isSuccess) {
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
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
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
          {autoRedirect && (
            <p className="text-emerald-600 font-semibold mb-4">
              Redirecting to your orders in {redirectCountdown} seconds...
            </p>
          )}
          {autoRedirect && (
            <button
              onClick={() => setAutoRedirect(false)}
              className="text-sm text-gray-500 hover:text-gray-700 underline mb-4"
            >
              Cancel auto-redirect
            </button>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders?success=true"
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
            >
              View Your Orders Now
            </Link>
            <Link
              href="/"
              className="border-2 border-emerald-500 text-emerald-700 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Stripe Card Element */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Card Information *
                </label>
                <div className={`p-4 border-2 rounded-lg bg-white ${
                  errors.payment ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <CardElement
                    onChange={(event) => {
                      if (event.error) {
                        let errorMessage = event.error?.message || 'Invalid card information'
                        
                        // Provide more specific error messages
                        if (event.error.code === 'incomplete_cvc') {
                          errorMessage = 'Please enter your card\'s security code (CVC)'
                        } else if (event.error.code === 'incomplete_expiry') {
                          errorMessage = 'Please enter your card\'s expiration date'
                        } else if (event.error.code === 'incomplete_number') {
                          errorMessage = 'Please enter your card number'
                        } else if (event.error.code === 'invalid_cvc') {
                          errorMessage = 'Your card\'s security code (CVC) is incorrect'
                        } else if (event.error.code === 'invalid_expiry') {
                          errorMessage = 'Your card\'s expiration date is invalid'
                        } else if (event.error.code === 'invalid_number') {
                          errorMessage = 'Your card number is invalid'
                        }
                        
                        setErrors(prev => ({ ...prev, payment: errorMessage }))
                      } else {
                        setErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.payment
                          return newErrors
                        })
                      }
                    }}
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#374151',
                          fontFamily: 'system-ui, sans-serif',
                          '::placeholder': {
                            color: '#9CA3AF',
                          },
                        },
                        invalid: {
                          color: '#EF4444',
                        },
                      },
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Please ensure your card details are correct, including expiration date and CVC.
                </p>
                {errors.payment && (
                  <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-3">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-red-700 font-medium">Payment Error</span>
                    </div>
                    <p className="text-red-600 text-sm mb-3">
                      {errors.payment}
                    </p>
                    <button
                      type="button"
                      onClick={handleTryAgain}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Try Again (Sign In)
                    </button>
                  </div>
                )}
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  placeholder="John Doe"
                                      className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-medium text-gray-900 bg-white transition-colors ${
                      errors.cardholderName 
                        ? 'border-red-500 bg-red-50' 
                        : formData.cardholderName.trim() && !errors.cardholderName
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 focus:border-emerald-500'
                    } focus:outline-none`}
                />
                {errors.cardholderName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.cardholderName}
                  </p>
                )}
                {formData.cardholderName.trim() && !errors.cardholderName && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Cardholder name looks good
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-medium text-gray-900 bg-white transition-colors ${
                    errors.email 
                      ? 'border-red-500 bg-red-50' 
                      : formData.email.trim() && !errors.email
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 focus:border-amber-500'
                  } focus:outline-none`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
                {formData.email.trim() && !errors.email && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Email address looks good
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-medium text-gray-900 bg-white transition-colors ${
                    errors.phone 
                      ? 'border-red-500 bg-red-50' 
                      : formData.phone.trim() && !errors.phone
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 focus:border-amber-500'
                  } focus:outline-none`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
                {formData.phone.trim() && !errors.phone && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Phone number looks good
                  </p>
                )}
              </div>

              {/* Billing Address */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Billing Address</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-medium text-gray-900 bg-white transition-colors ${
                        errors.address 
                          ? 'border-red-500 bg-red-50' 
                          : formData.address.trim() && !errors.address
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 focus:border-amber-500'
                      } focus:outline-none`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.address}
                      </p>
                    )}
                    {formData.address.trim() && !errors.address && (
                      <p className="text-green-600 text-sm mt-1 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Address looks good
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="New York"
                        className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-medium text-gray-900 bg-white transition-colors ${
                          errors.city 
                            ? 'border-red-500 bg-red-50' 
                            : formData.city.trim() && !errors.city
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 focus:border-amber-500'
                        } focus:outline-none`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.city}
                        </p>
                      )}
                      {formData.city.trim() && !errors.city && (
                        <p className="text-green-600 text-sm mt-1 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          City looks good
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="NY"
                        className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-medium text-gray-900 bg-white transition-colors ${
                          errors.state 
                            ? 'border-red-500 bg-red-50' 
                            : formData.state.trim() && !errors.state
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 focus:border-amber-500'
                        } focus:outline-none`}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.state}
                        </p>
                      )}
                      {formData.state.trim() && !errors.state && (
                        <p className="text-green-600 text-sm mt-1 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          State looks good
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="10001"
                      className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-medium text-gray-900 bg-white transition-colors ${
                        errors.zipCode 
                          ? 'border-red-500 bg-red-50' 
                          : formData.zipCode.trim() && !errors.zipCode
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 focus:border-amber-500'
                      } focus:outline-none`}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.zipCode}
                      </p>
                    )}
                    {formData.zipCode.trim() && !errors.zipCode && (
                      <p className="text-green-600 text-sm mt-1 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        ZIP code looks good
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Validation Summary */}
              {Object.keys(errors).filter(key => errors[key] && errors[key].trim() !== '').length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="text-red-800 font-semibold mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Please fix the following errors:
                  </h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    {Object.entries(errors)
                      .filter(([field, error]) => error && error.trim() !== '')
                      .map(([field, error]) => (
                        <li key={field} className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {error}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || Object.keys(errors).filter(key => errors[key] && errors[key].trim() !== '').length > 0}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </div>
                ) : Object.keys(errors).filter(key => errors[key] && errors[key].trim() !== '').length > 0 ? (
                  <div className="flex items-center justify-center space-x-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Please fix form errors</span>
                  </div>
                ) : (
                  `Pay $${finalTotal.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.img || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                        {testProductIds.includes(item.id) && (
                          <span className="text-xs text-green-600 ml-1">(no tax)</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                {/* Test Product Notice */}
                {hasOnlyTestProducts && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">
                        🎁 Test products: Original price, no tax or shipping!
                      </span>
                    </div>
                  </div>
                )}
                {hasTestProducts && hasRegularProducts && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">
                        🎁 Test products: Original price, no tax!
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-black font-semibold">Subtotal</span>
                  <span className="font-semibold text-green-600">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-semibold">Shipping</span>
                  <span className="font-semibold text-green-600">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-semibold">
                    Tax
                    {hasTestProducts && (
                      <span className="text-xs text-gray-500 ml-1">(test products tax-free)</span>
                    )}
                  </span>
                  <span className="font-semibold text-green-600">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-gray-200 pt-3">
                  <span className="text-black">Total</span>
                  <span className="text-green-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">PCI DSS compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Secure payment processing</span>
                </div>
              </div>
            </div>
          </div>
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

  // Check if user is authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to proceed with checkout. Please sign in to continue with your purchase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="border-2 border-emerald-500 text-emerald-700 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <Link
            href="/products"
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  // Check if Stripe is properly configured
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Stripe Not Configured</h1>
          <p className="text-gray-600 mb-6">
            Please set up your Stripe environment variables to enable payment processing.
          </p>
          <Link
            href="/cart"
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  )
}

export default CheckoutPage
