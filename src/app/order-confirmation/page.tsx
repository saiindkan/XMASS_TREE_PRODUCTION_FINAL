"use client";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(15);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Get payment intent ID from URL if available
    const paymentIntentId = searchParams.get("payment_intent");
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");

    if (paymentIntentId) {
      // Fetch order details from API using payment intent ID
      fetchOrderDetails(paymentIntentId);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (paymentIntentId: string) => {
    try {
      const response = await fetch(`/api/orders?id=${paymentIntentId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.order) {
          // Check if payment actually succeeded
          if (data.order.payment_status === 'succeeded' || data.order.status === 'paid') {
            setOrderDetails({
              id: data.order.id,
              status: data.order.status || "confirmed",
              timestamp: data.order.created_at || new Date().toISOString(),
              total: data.order.total,
              items: data.order.items || []
            });
          } else {
            // Payment hasn't succeeded yet, redirect back to checkout
            console.log('❌ Payment not yet succeeded, redirecting to checkout');
            window.location.href = '/checkout';
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      // Fallback to basic details
      setOrderDetails({
        id: paymentIntentId,
        status: "confirmed",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer and redirect logic
  useEffect(() => {
    if (isLoading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          // Redirect to home page
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Your payment has been processed successfully. We're preparing your Christmas tree for delivery!
          </p>

          {/* Countdown Timer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-yellow-800 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-medium">
                Redirecting to home page in <span className="font-bold text-yellow-900">{countdown}</span> seconds
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-yellow-200 rounded-full h-2 mb-3">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((15 - countdown) / 15) * 100}%` }}
              ></div>
            </div>
            
            {/* Skip Countdown Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setIsRedirecting(true);
                  window.location.href = '/';
                }}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
                Go to Home Page Now
              </button>
            </div>
            
            {isRedirecting && (
              <p className="text-xs text-yellow-700 text-center mt-3">
                Redirecting now...
              </p>
            )}
          </div>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono text-gray-900">{orderDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600 font-medium capitalize">{orderDetails.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(orderDetails.timestamp).toLocaleDateString()}</span>
                </div>
                {orderDetails.total && (
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold text-gray-900">${orderDetails.total.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              {/* Order Items */}
              {orderDetails.items && orderDetails.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Items Ordered:</h3>
                  <div className="space-y-2">
                    {orderDetails.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>You'll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Our team will process your order within 24 hours</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>We'll notify you when your tree is ready for delivery</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Continue Shopping
            </Link>
            
            <Link
              href="/account"
              className="inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              View Orders
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Have questions about your order?
            </p>
            <Link
              href="/contact"
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              Contact our support team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
