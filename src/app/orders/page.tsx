"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  CreditCard, 
  Truck, 
  User, 
  MapPin, 
  ShoppingBag, 
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  total_price: number;
  product_image?: string;
}

interface Order {
  id: string;
  order_number?: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total: number;
  currency: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  notes?: string;
  tracking_number?: string;
  estimated_delivery_date?: string;
  order_items: OrderItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
  };
  billing_address?: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
    email?: string;
  };
  shipping_address?: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
    email?: string;
  };
  payment?: any;
  payment_status?: string;
  payment_intent_id?: string;
  payment_method?: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin?callbackUrl=/orders");
      return;
    }

    // Check if user came from successful payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      // Remove success parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      
      console.log('📥 Orders API response:', data);
      
      if (data.orders) {
        // Sort orders by creation date (newest first)
        const sortedOrders = data.orders.sort((a: Order, b: Order) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        console.log('📊 Processed orders:', sortedOrders.map(order => ({
          id: order.id,
          status: order.status,
          order_status: order.order_status,
          payment_status: order.payment_status,
          total: order.total,
          itemsCount: order.order_items?.length || 0,
          orderItems: order.order_items
        })));
        
        setOrders(sortedOrders);
        
        // Auto-select the most recent order if user came from successful payment
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true' && sortedOrders.length > 0) {
          setSelectedOrder(sortedOrders[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending_payment":
        return "bg-yellow-100 text-yellow-800";
      case "payment_failed":
        return "bg-red-100 text-red-800";
      case "canceled":
        return "bg-gray-100 text-gray-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  if (status === "loading" || isLoading) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1577973465936-1e0f2e7d8171?auto=format&fit=crop&w=2000&q=80)',
        }}
      >
        {/* Background Overlay for Content Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-green-50/80 to-red-50/70"></div>
        <div className="absolute inset-0 bg-black/5"></div>
        
        <div className="relative text-center bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/30">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed py-12"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1577973465936-1e0f2e7d8171?auto=format&fit=crop&w=2000&q=80)',
      }}
    >
      {/* Background Overlay for Content Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-green-50/80 to-red-50/70"></div>
      <div className="absolute inset-0 bg-black/5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track your orders and view order history
          </p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🎉 Payment Successful!
                </h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p>✅ Your order has been placed and is being processed</p>
                  <p>📧 Check your email for order confirmation and tracking details</p>
                  <p>📱 You'll receive SMS updates on your order status</p>
                  <p>📦 Your order will be shipped within 1-2 business days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start shopping to see your orders here. Your order history will appear once you make your first purchase.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order History ({orders.length})
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className={`p-6 cursor-pointer transition-colors duration-150 ${
                        selectedOrder?.id === order.id ? 'bg-green-50 border-l-4 border-l-green-500' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-mono text-gray-500">
                              {order.order_number || `#${order.id.slice(0, 8)}`}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)} flex items-center`}>
                              {order.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {order.status === 'pending_payment' && <Clock className="h-3 w-3 mr-1" />}
                              {order.status === 'payment_failed' && <AlertCircle className="h-3 w-3 mr-1" />}
                              {getStatusLabel(order.status)}
                            </span>
                            {/* Payment Status Indicator */}
                            {(order.payment_status === 'succeeded' || order.status === 'paid') && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                💳 Paid
                              </span>
                            )}
                            {(order.payment_status === 'failed' || order.status === 'payment_failed') && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                ❌ Payment Failed
                              </span>
                            )}
                            {(!order.payment_status || order.payment_status === 'pending') && order.status !== 'paid' && order.status !== 'payment_failed' && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                ⏳ Payment Pending
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            {order.order_items?.length || 0} {(order.order_items?.length || 0) === 1 ? 'item' : 'items'}
                            {!order.order_items && <span className="text-red-500"> (No items data)</span>}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ${order.total.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.currency.toUpperCase()}
                          </div>
                          
                          {/* Checkout Button for Pending Payments */}
                          {(order.payment_status !== 'succeeded' && order.status !== 'paid') && (
                            <div className="mt-2">
                              <Link
                                href={`/checkout?orderId=${order.id}&completePayment=true`}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                </svg>
                                Complete Payment
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-1">
              {selectedOrder ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Details
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Order Information */}
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-600" />
                        Order Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Order Number:</span>
                          <p className="text-sm text-gray-900 font-mono">{selectedOrder.order_number || selectedOrder.id}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Order Status:</span>
                          <div className="mt-1">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                              {getStatusLabel(selectedOrder.status)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Order Date:</span>
                          <p className="text-sm text-gray-900">
                            {new Date(selectedOrder.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {selectedOrder.paid_at && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Payment Date:</span>
                            <p className="text-sm text-gray-900">
                              {new Date(selectedOrder.paid_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                        {selectedOrder.tracking_number && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Tracking Number:</span>
                            <p className="text-sm text-gray-900 font-mono">{selectedOrder.tracking_number}</p>
                          </div>
                        )}
                        {selectedOrder.estimated_delivery_date && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Estimated Delivery:</span>
                            <p className="text-sm text-gray-900">
                              {new Date(selectedOrder.estimated_delivery_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-600" />
                        Payment Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Payment Status:</span>
                          <div className="mt-1">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedOrder.payment_status === 'succeeded' || selectedOrder.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : selectedOrder.payment_status === 'failed' || selectedOrder.status === 'payment_failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedOrder.payment_status === 'succeeded' || selectedOrder.status === 'paid'
                                ? 'Payment Successful'
                                : selectedOrder.payment_status === 'failed' || selectedOrder.status === 'payment_failed'
                                ? 'Payment Failed'
                                : selectedOrder.payment_status === 'pending'
                                ? 'Payment Pending'
                                : selectedOrder.payment_status || 'Payment Pending'}
                            </span>
                          </div>
                        </div>
                        {selectedOrder.payment_method && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Payment Method:</span>
                            <p className="text-sm text-gray-900">{selectedOrder.payment_method}</p>
                          </div>
                        )}
                        {selectedOrder.payment_intent_id && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Payment ID:</span>
                            <p className="text-sm text-gray-900 font-mono">{selectedOrder.payment_intent_id}</p>
                          </div>
                        )}
                        {selectedOrder.paid_at && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Payment Date:</span>
                            <p className="text-sm text-gray-900">
                              {new Date(selectedOrder.paid_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                        {selectedOrder.payment_status === 'pending' && selectedOrder.status !== 'paid' && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              💡 <strong>Payment Required:</strong> This order is waiting for payment completion. 
                              Click "Complete Payment" to finish your purchase.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-600" />
                        Pricing Breakdown
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Subtotal:</span>
                          <span className="text-sm text-gray-900">${selectedOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Tax:</span>
                          <span className="text-sm text-gray-900">${selectedOrder.tax_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Shipping:</span>
                          <span className="text-sm text-gray-900">${selectedOrder.shipping_amount.toFixed(2)}</span>
                        </div>
                        {selectedOrder.discount_amount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Discount:</span>
                            <span className="text-sm text-red-600">-${selectedOrder.discount_amount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-gray-200 pt-2">
                          <span className="text-sm font-semibold text-gray-900">Total:</span>
                          <span className="text-lg font-bold text-green-600">${selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Customer Information */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-600" />
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Name:</span>
                        <p className="text-sm text-gray-900">
                          {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="text-sm text-gray-900">{selectedOrder.customer.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone:</span>
                        <p className="text-sm text-gray-900">{selectedOrder.customer.phone}</p>
                      </div>
                      {selectedOrder.customer.company && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Company:</span>
                          <p className="text-sm text-gray-900">{selectedOrder.customer.company}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Billing Address */}
                  {selectedOrder.billing_address && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                        Billing Address
                      </h4>
                      <div className="text-sm text-gray-900">
                        <p>{selectedOrder.billing_address.address_line_1}</p>
                        {selectedOrder.billing_address.address_line_2 && (
                          <p>{selectedOrder.billing_address.address_line_2}</p>
                        )}
                        <p>
                          {selectedOrder.billing_address.city}, {selectedOrder.billing_address.state} {selectedOrder.billing_address.postal_code}
                        </p>
                        <p>{selectedOrder.billing_address.country}</p>
                        {selectedOrder.billing_address.phone && (
                          <p className="mt-2 text-gray-500">Phone: {selectedOrder.billing_address.phone}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Shipping Address */}
                  {selectedOrder.shipping_address && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-gray-600" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-900">
                        <p>{selectedOrder.shipping_address.address_line_1}</p>
                        {selectedOrder.shipping_address.address_line_2 && (
                          <p>{selectedOrder.shipping_address.address_line_2}</p>
                        )}
                        <p>
                          {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}
                        </p>
                        <p>{selectedOrder.shipping_address.country}</p>
                        {selectedOrder.shipping_address.phone && (
                          <p className="mt-2 text-gray-500">Phone: {selectedOrder.shipping_address.phone}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-2 text-gray-600" />
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.order_items.map((item, index) => (
                        <div key={item.id || `item-${index}`} className="flex items-center space-x-3">
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.product_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} × ${(item.total_price / item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            ${item.total_price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    {/* Payment Status Display */}
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-500">Payment Status:</span>
                      <div className="mt-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedOrder.payment_status === 'succeeded' || selectedOrder.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : selectedOrder.payment_status === 'failed' || selectedOrder.status === 'payment_failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedOrder.payment_status === 'succeeded' || selectedOrder.status === 'paid'
                            ? 'Payment Successful'
                            : selectedOrder.payment_status === 'failed' || selectedOrder.status === 'payment_failed'
                            ? 'Payment Failed'
                            : 'Payment Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Payment Status Info */}
                    {selectedOrder.payment_status !== 'succeeded' && selectedOrder.status !== 'paid' && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Payment Required
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          Complete your payment to confirm your order
                        </p>
                        
                        {/* Checkout Button for Pending Payments */}
                        <Link
                          href={`/checkout?orderId=${selectedOrder.id}&completePayment=true`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                          </svg>
                          Complete Payment
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Select an order to view details
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Only orders with successful payments can show full details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
