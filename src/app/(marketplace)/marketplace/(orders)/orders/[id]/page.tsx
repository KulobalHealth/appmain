"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "../../sidebar";
import { useOrdersStore } from "@/store/orders-store";
import { usePaymentOrdersStore } from "@/store/payment-orders-store";
import { useAuthStore } from "@/store/auth-store";
import { payWithPaystack } from "@/lib/paystack";
import toast from "react-hot-toast";

export default function OrderDetails() {
  const params = useParams();
  const { fetchOrderById, fetchOrders } = useOrdersStore();
  const { createPayment } = usePaymentOrdersStore();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Calculate arrears for installment orders
  // Outstanding = Full Amount - Amount Payable
  const isInstallmentOrder = order?.paymentType === "installment-payment";
  const totalCost = order?.totalCost || 0;
  const amountPayable = order?.raw?.amountPayable || 0;
  const amountPaid = order?.raw?.amountPaid || 0;
  const arrears = totalCost - amountPayable;
  const isFullyPaid = arrears <= 0;
  const hasOutstandingBalance = isInstallmentOrder && !isFullyPaid && amountPaid > 0;

  const handlePayRemainingBalance = async () => {
    if (!user?.email) {
      toast.error("User email not found. Please log in again.");
      return;
    }

    if (arrears <= 0) {
      toast.error("No outstanding balance to pay.");
      return;
    }

    setIsProcessingPayment(true);
    const loadingToast = toast.loading("Processing payment...");

    try {
      const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!paystackPublicKey) {
        toast.error("Paystack is not configured. Please contact support.");
        return;
      }

      const reference = `PAY_${order.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
          toast.dismiss(loadingToast);
          toast.success("Payment successful! Updating order...");

          try {
            const pharmacyId = user?.pharmacyId || 
              (typeof user?.pharmacy === 'object' ? user.pharmacy?.pharmacyId : user?.pharmacy);

            if (!pharmacyId) {
              throw new Error("Pharmacy ID not found");
            }

            await createPayment({
              pharmacyId: pharmacyId,
              orderId: order.id,
              amountPaid: arrears,
              reference: response?.reference || reference,
            });

            toast.success("Payment recorded successfully!");
            
            // Refresh orders
            await fetchOrders();
            
            // Reload the order
            const updatedOrder = await fetchOrderById(order.id);
            setOrder(updatedOrder);
            
            setIsProcessingPayment(false);
          } catch (error: any) {
            console.error("Error recording payment:", error);
            toast.error(error.message || "Payment successful but failed to update order. Please contact support.");
            setIsProcessingPayment(false);
          }
        },
        onClose: () => {
          toast.dismiss(loadingToast);
          setIsProcessingPayment(false);
        },
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    const loadOrder = async () => {
      if (params.id) {
        console.log('Loading order with ID:', params.id);
        const orderData = await fetchOrderById(params.id as string);
        console.log('Loaded order data:', orderData);
        setOrder(orderData);
        setLoading(false);
      }
    };
    loadOrder();
  }, [params.id, fetchOrderById]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="flex flex-col md:flex-row container mx-auto">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/marketplace/orders"
            className="inline-flex items-center text-sm font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>

          <Button className="bg-emerald-500 hover:bg-emerald-600">
            Order again <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-gray-500">Order No.</div>
            <div className="font-medium">#{order.orderNumber || order.id}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Date ordered:</div>
            <div className="font-medium">
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Date delivered:</div>
            <div className="font-medium">
              {order.deliveredAt
                ? new Date(order.deliveredAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Pending"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total:</div>
            <div className="font-medium">GHS {(order.totalCost || 0).toFixed(2)}</div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-white dark:bg-background mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="bg-gray-100 dark:bg-neutral-900 p-4 rounded-md w-full md:w-36 h-36 flex items-center justify-center">
              <Image
                src="/med.png"
                alt="Product"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold">Order Items</h3>
              <div className="space-y-2 mt-2">
                {order.items.map((item: any) => (
                  <div key={item.id || item.productId} className="flex justify-between">
                    <span>{item.quantity}x {item.name || 'Product'}</span>
                    <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div
                className={`mt-4 inline-flex items-center px-2 py-1 rounded-full ${
                  order.status === "delivered"
                    ? "bg-emerald-100 text-emerald-800"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : order.status === "shipped"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                } text-xs`}
              >
                <CheckCircle className="mr-1 h-3 w-3" />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-background">
            <div className="p-4 border-b">
              <h2 className="font-bold">Payment Details</h2>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Payment Method</div>
                  <div className="font-medium">
                    {order.paymentMethod 
                      ? order.paymentMethod === "online-payment" || order.paymentMethod === "PAYMENT_ON_ONLINE"
                        ? "Online Payment"
                        : order.paymentMethod === "cash-on-delivery" || order.paymentMethod === "PAYMENT_ON_DELIVERY"
                        ? "Cash on Delivery"
                        : order.paymentMethod
                      : "Not specified"}
                  </div>
                </div>

                {/* Payment Type, Installment features, and Outstanding Payment hidden */}

                <div className="pt-2">
                  <div className="text-sm font-medium">Details</div>

                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Item Total</span>
                      <span className="text-sm">
                        GHS {(order.totalCost || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Delivery Fees
                      </span>
                      <span className="text-sm">GHS 0.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-sm text-gray-500">Total:</span>
                      <span className="text-sm">
                        GHS {(order.totalCost || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-white dark:bg-background">
            <div className="p-4 border-b">
              <h2 className="font-bold">Delivery Details</h2>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Delivery Method</div>
                  <div className="font-medium">
                    {order.deliveryMethod 
                      ? order.deliveryMethod === "EXPRESS" || order.deliveryMethod === "express"
                        ? "Express Delivery"
                        : order.deliveryMethod === "REGULAR" || order.deliveryMethod === "normal"
                        ? "Regular Delivery"
                        : order.deliveryMethod
                      : "Not specified"}
                  </div>
                </div>
                {order.raw?.deliveryId && (
                  <div>
                    <div className="text-sm text-gray-500">Delivery Address ID</div>
                    <div className="text-sm font-medium">{order.raw.deliveryId}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-white dark:bg-background">
          <div className="p-4 border-b">
            <h2 className="font-bold">Order Tracking</h2>
          </div>

          <div className="p-4">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-emerald-500"></div>

              <div className="space-y-6">
                {order.tracking?.map((track: any, index: number) => (
                  <div key={index} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="font-medium">{track.status}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(track.timestamp || track.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
