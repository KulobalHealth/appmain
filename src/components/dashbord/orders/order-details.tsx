"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Truck, CheckCircle, XCircle, Package, CreditCard, MapPin, Calendar, Hash, ShoppingBag, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Order } from "@/store/orders-store"
import CancelOrderModal from "./cancel-order-modal"
import { usePaymentOrdersStore } from "@/store/payment-orders-store"
import { useAuthStore } from "@/store/auth-store"
import { payWithPaystack } from "@/lib/paystack"
import toast from "react-hot-toast"
import { useOrdersStore } from "@/store/orders-store"
import { useCartStore } from "@/store/cart-store"
import { useRouter } from "next/navigation"

interface OrderDetailsProps {
  order: Order
  onBack: () => void
}

export default function OrderDetails({ order, onBack }: OrderDetailsProps) {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  const { createPayment } = usePaymentOrdersStore()
  const { user } = useAuthStore()
  const { fetchOrders } = useOrdersStore()
  const { addItem } = useCartStore()
  const router = useRouter()

  // Calculate arrears (remaining balance) for installment orders
  const isInstallmentOrder = order.paymentType === "installment-payment"
  const totalCost = order.totalCost || 0
  const amountPayable = order.raw?.amountPayable || 0
  const amountPaid = order.raw?.amountPaid || 0
  const arrears = totalCost - amountPayable
  const isFullyPaid = arrears <= 0
  const hasOutstandingBalance = isInstallmentOrder && !isFullyPaid && amountPaid > 0

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: <Clock className="w-4 h-4" />,
          label: "Pending"
        }
      case "processing":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: <Package className="w-4 h-4" />,
          label: "Processing"
        }
      case "shipped":
        return {
          bg: "bg-indigo-50",
          text: "text-indigo-700",
          border: "border-indigo-200",
          icon: <Truck className="w-4 h-4" />,
          label: "Shipped"
        }
      case "delivered":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Delivered"
        }
      case "cancelled":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: <XCircle className="w-4 h-4" />,
          label: "Cancelled"
        }
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: <Clock className="w-4 h-4" />,
          label: status
        }
    }
  }

  const handleCancelOrder = () => {
    setShowCancelModal(true)
  }

  const handleConfirmCancel = (reason: string) => {
    console.log("Order cancelled with reason:", reason)
  }

  const handlePayRemainingBalance = async () => {
    if (!user?.email) {
      toast.error("User email not found. Please log in again.")
      return
    }

    if (arrears <= 0) {
      toast.error("No outstanding balance to pay.")
      return
    }

    setIsProcessingPayment(true)
    const loadingToast = toast.loading("Processing payment...")

    try {
      const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
      if (!paystackPublicKey) {
        toast.error("Paystack is not configured. Please contact support.")
        return
      }

      const reference = `PAY_${order.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      await payWithPaystack({
        key: paystackPublicKey,
        email: user.email,
        amount: arrears,
        ref: reference,
        currency: "GHS",
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentType: "installment-balance",
        },
        onSuccess: async (response: any) => {
          toast.dismiss(loadingToast)
          toast.success("Payment successful! Updating order...")

          try {
            const pharmacyId = user?.pharmacyId || 
              (typeof user?.pharmacy === 'object' ? user.pharmacy?.pharmacyId : user?.pharmacy)

            if (!pharmacyId) {
              throw new Error("Pharmacy ID not found")
            }

            await createPayment({
              pharmacyId: pharmacyId,
              orderId: order.id,
              amountPaid: arrears,
              reference: response?.reference || reference,
            })

            toast.success("Payment recorded successfully!")
            await fetchOrders()
            
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          } catch (error: any) {
            console.error("Error recording payment:", error)
            toast.error(error.message || "Payment successful but failed to update order. Please contact support.")
          }
        },
        onClose: () => {
          toast.dismiss(loadingToast)
          setIsProcessingPayment(false)
        },
      })
    } catch (error: any) {
      toast.dismiss(loadingToast)
      console.error("Payment error:", error)
      toast.error(error.message || "Payment failed. Please try again.")
      setIsProcessingPayment(false)
    }
  }

  const statusConfig = getStatusConfig(order.status)
  
  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

  // Payment method display
  const getPaymentMethodDisplay = () => {
    if (!order.paymentMethod) return "Not specified"
    if (order.paymentMethod === "online-payment" || order.paymentMethod === "PAYMENT_ON_ONLINE") {
      return "Online Payment"
    }
    if (order.paymentMethod === "cash-on-delivery" || order.paymentMethod === "PAYMENT_ON_DELIVERY") {
      return "Cash on Delivery"
    }
    return order.paymentMethod
  }

  // Delivery method display
  const getDeliveryMethodDisplay = () => {
    if (!order.deliveryMethod) return "Not specified"
    if (order.deliveryMethod === "EXPRESS" || order.deliveryMethod === "express") {
      return "Express Delivery"
    }
    if (order.deliveryMethod === "REGULAR" || order.deliveryMethod === "normal") {
      return "Standard Delivery"
    }
    return order.deliveryMethod
  }

  // Handle reorder - add all items to cart
  const handleReorder = async () => {
    setIsReordering(true)
    const loadingToast = toast.loading("Adding items to cart...")

    try {
      // Add each item to cart
      for (const item of order.items) {
        await addItem({
          productId: item.productId || item.id || '',
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
          supplierId: item.supplierId || '',
          supplierName: item.supplierName || '',
        })
      }

      toast.dismiss(loadingToast)
      toast.success(`${order.items.length} item${order.items.length > 1 ? 's' : ''} added to cart!`)
      
      // Navigate to cart
      router.push('/cart')
    } catch (error: any) {
      toast.dismiss(loadingToast)
      console.error("Reorder error:", error)
      toast.error(error.message || "Failed to add items to cart. Please try again.")
    } finally {
      setIsReordering(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Orders</span>
          </button>
          
          <div className="flex items-center gap-3">
            {/* Reorder Button */}
            <Button 
              onClick={handleReorder}
              disabled={isReordering}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-[10px] flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isReordering ? 'animate-spin' : ''}`} />
              {isReordering ? "Adding..." : "Reorder"}
            </Button>

            {/* Cancel Order Button - only for active orders */}
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <Button 
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 rounded-[10px]"
                onClick={handleCancelOrder}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* Order Status Banner */}
        <div className={`${statusConfig.bg} ${statusConfig.border} border rounded-2xl p-4 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${statusConfig.text} p-2 rounded-full ${statusConfig.bg}`}>
                {statusConfig.icon}
              </div>
              <div>
                <p className={`font-semibold ${statusConfig.text}`}>{statusConfig.label}</p>
                <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Placed on</p>
              <p className="font-medium text-gray-900">{orderDate}</p>
              <p className="text-sm text-gray-500">{orderTime}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Order Items</h2>
            <span className="text-sm text-gray-500 ml-auto">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="divide-y divide-gray-100">
            {order.items.map((item, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × GH₵ {item.price.toFixed(2)}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">GH₵ {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Delivery Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Payment</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-900">{getPaymentMethodDisplay()}</span>
              </div>
              
              {isInstallmentOrder && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Type</span>
                  <span className="font-medium text-emerald-600">Installment</span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">GH₵ {(order.raw?.subtotal ?? totalCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">GH₵ {(order.raw?.deliveryFee ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">VAT (12.5%)</span>
                  <span className="text-gray-900">GH₵ {(order.raw?.tax ?? (totalCost * 0.125)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">GH₵ {totalCost.toFixed(2)}</span>
                </div>
              </div>

              {hasOutstandingBalance && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-amber-800 font-medium">Outstanding Balance</span>
                    <span className="font-bold text-amber-800">GH₵ {arrears.toFixed(2)}</span>
                  </div>
                  <Button 
                    onClick={handlePayRemainingBalance}
                    disabled={isProcessingPayment}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-[10px]"
                  >
                    {isProcessingPayment ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Delivery</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery Method</span>
                <span className="font-medium text-gray-900">{getDeliveryMethodDisplay()}</span>
              </div>
              
              {order.raw?.deliveryId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery ID</span>
                  <span className="font-medium text-gray-900 text-sm">{order.raw.deliveryId}</span>
                </div>
              )}

              {/* Delivery Address Placeholder */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Delivery Address</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Address details will be shown here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline/Info */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Order Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Hash className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">{orderDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="font-medium text-gray-900">{totalItems} items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        orderNumber={order.orderNumber}
      />
    </div>
  )
}
