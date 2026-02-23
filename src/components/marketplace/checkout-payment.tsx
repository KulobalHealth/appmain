"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, MapPin, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/store/cart-store"
import { useAuthStore } from "@/store/auth-store"
import { useDeliveryAddressStore } from "@/store/delivery-address-store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import axios from "axios"
import { payWithPaystack } from "@/lib/paystack"
import { useOrdersStore } from "@/store/orders-store"
import { usePaymentOrdersStore } from "@/store/payment-orders-store"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import CheckoutSkeleton from "./checkout-skeleton"

export default function CheckoutPage() {
  const { totalItems, totalPrice, items, clearCart, fetchCartItems } = useCartStore()
  const { createOrder } = useOrdersStore()
  const { createPayment } = usePaymentOrdersStore()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const router = useRouter()
  
  // Use delivery address store
  const {
    addresses,
    selectedAddressId,
    isLoading: addressLoading,
    error: addressError,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
    clearError
  } = useDeliveryAddressStore()
  
  const [deliveryMethod, setDeliveryMethod] = useState<"normal" | "express">("normal")
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash-on-delivery" | "">("")
  const [paymentType, setPaymentType] = useState<string>("")
  const [installmentPercentage, setInstallmentPercentage] = useState<number>(0)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false)
  const [formData, setFormData] = useState({
    location: "",
    streetAddress: "",
    gpsAddress: "",
  })

  // Initialize form data and fetch addresses
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({
        location: user.location || "",
        streetAddress: "",
        gpsAddress: "",
      })
      
      // Fetch addresses when user data is available
      fetchAddresses()
    }
  }, [user, fetchAddresses])


  // Fetch cart items when component mounts and user is authenticated
   useEffect(() => {
     if (isAuthenticated) {
       console.log("CheckoutPage - Fetching cart items on mount")
       fetchCartItems()
     }
   }, [isAuthenticated, fetchCartItems])

   // Set initial loading to false after data is fetched
   useEffect(() => {
     if (addresses.length >= 0 && items.length >= 0) {
       // Small delay to ensure smooth transition
       const timer = setTimeout(() => setIsInitialLoading(false), 500)
       return () => clearTimeout(timer)
     }
   }, [addresses.length, items.length])

  // Memoize calculated values
  const calculations = useMemo(() => {
    const subtotal = totalPrice || 0
    const taxPercentage = 12.5
    // Express delivery: 10%, Normal delivery: 5%
    const deliveryFeePercentage = deliveryMethod === "express" ? 10 : 5
    const deliveryFee = subtotal > 0 ? (subtotal * deliveryFeePercentage) / 100 : 0
    const tax = subtotal > 0 ? (subtotal * taxPercentage) / 100 : 0
    const total = subtotal + deliveryFee + tax

    return {
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryFeePercentage,
      taxPercentage,
    }
  }, [totalPrice, deliveryMethod])

  const { subtotal, deliveryFee, tax, total, deliveryFeePercentage, taxPercentage } = calculations

  // Get items summary for display
  const itemsSummary = useMemo(() => {
    return items.map((item) => `${item.name} (x${item.quantity})`).join(", ")
  }, [items])

  // Calculate installment payment amounts
  const amountPaid = useMemo(() => {
    return installmentPercentage > 0 ? (total * installmentPercentage) / 100 : 0
  }, [installmentPercentage, total])

  const remainingBalance = useMemo(() => {
    return total - amountPaid
  }, [total, amountPaid])

  // Get selected address
  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId)

  // Payment method handlers
  const handlePaymentMethodChange = useCallback((method: "online" | "cash-on-delivery") => {
    setPaymentMethod(method)
  }, [])

  // Payment type handlers
  const handlePaymentTypeChange = useCallback((type: string) => {
    setPaymentType(type)
    if (type !== "installment-payment") {
      setInstallmentPercentage(0)
    }
  }, [])

  // Form submission to create address via API
  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.location || !formData.streetAddress) {
      clearError()
      return
    }

    const result = await addAddress({
      location: formData.location,
      streetAddress: formData.streetAddress,
      gpsAddress: formData.gpsAddress
    })

    if (result.success) {
        // Clear form after successful submission
        setFormData({
          location: "",
          streetAddress: "",
          gpsAddress: "",
        })
      }
  }, [formData, addAddress, clearError])

  // Update form data
  const updateFormData = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (addressError) {
      clearError()
    }
  }, [addressError, clearError])

  // Address card management functions
  const removeAddress = useCallback(async (id: string) => {
    await deleteAddress(id)
  }, [deleteAddress])

  const setDefaultAddress = useCallback(async (id: string) => {
    // Note: Setting default address may require a separate API endpoint
    // For now, we'll just select it in the UI
    setSelectedAddress(id)
  }, [setSelectedAddress])

  // Handle continue to payment button click
  const handleContinueToPayment = useCallback(() => {
    if (!selectedAddressId || !paymentMethod) {
      return
    }
    // Payment type is now defaulted to "full-payment" - no validation needed
    setShowConfirmationDialog(true)
  }, [selectedAddressId, paymentMethod])

  // Close confirmation dialog
  const closeConfirmationDialog = useCallback(() => {
    setShowConfirmationDialog(false)
  }, [])

  // Handle place order - with Paystack if online payment
  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddressId || !paymentMethod || !user || !selectedAddress) {
      toast.error("Please complete all required fields")
      return
    }

    // Default payment type to "full-payment" if not set
    const finalPaymentType = paymentType || "full-payment"

    try {
      // Calculate amount to pay - default to full payment
      const amountToPay = finalPaymentType === "installment-payment" ? amountPaid :
                          finalPaymentType === "credit" ? 0 : total

      // Get pharmacy details
      const pharmacyObj = typeof user.pharmacy === 'object' ? user.pharmacy : null
      const pharmacyDetails = {
        pharmacyName: pharmacyObj?.pharmacy || user.businessName || `${user.firstName} ${user.lastName}`,
        location: pharmacyObj?.location || user.location || "",
        licenceNumber: pharmacyObj?.licenceNumber || user.licenceNumber || "",
        branch: pharmacyObj?.branch || user.branch,
        region: pharmacyObj?.region || "",
        city: pharmacyObj?.city || "",
        gps: pharmacyObj?.gps || "",
        pharmacyBio: pharmacyObj?.pharmacyBio || user.pharmacyBio || "",
      }

      const resolvedPharmacyId =
        user.pharmacyId ||
        (typeof user.pharmacy === "string"
          ? user.pharmacy
          : pharmacyObj?.pharmacyId || pharmacyObj?.id)

      if (!resolvedPharmacyId) {
        toast.error("Unable to determine your pharmacy. Please update your profile and try again.")
        return
      }

      const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

      // Map deliveryMethod to backend enum: express -> EXPRESS, normal -> REGULAR
      const apiDeliveryMethod = deliveryMethod === "express" ? "EXPRESS" : "REGULAR"

      // Map paymentType to backend enum - default to "full-payment"
      const apiPaymentType =
        finalPaymentType === "full-payment"
          ? "full-payment"
          : finalPaymentType === "installment-payment"
          ? "installment-payment"
          : finalPaymentType === "credit"
          ? "credit"
          : "full-payment"

      // Map paymentMethod to backend enum
      const apiPaymentMethod = paymentMethod === "online" ? "online" : "cash-on-delivery"

      // Prepare order data for internal use
      const orderMetadata = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          category: item.product?.category,
          image: item.product?.images?.[0],
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        total: total,
        currency: "GHS",
        shippingDetails: {
          pharmacyName: pharmacyDetails.pharmacyName,
          phoneNumber: user.phoneNumber,
          pharmacyEmail: user.email,
          pharmacyLocation: selectedAddress.location,
          streetAddress: selectedAddress.streetAddress,
          gpsAddress: selectedAddress.gpsAddress || "",
        },
        pharmacyDetails: pharmacyDetails, // Add pharmacy details to order
        paymentDetails: {
          paymentType: (finalPaymentType === "full-payment" ? "full-payment" :
                        finalPaymentType === "installment-payment" ? "installment-payment" :
                        finalPaymentType === "credit" ? "deposit" : "full-payment") as 'full-payment' | 'installment-payment' | 'deposit' | 'credit',
          paymentMethod: (paymentMethod === "online" ? "online-payment" : "cash-on-delivery") as 'online-payment' | 'cash-on-delivery',
          amount: amountToPay,
          currency: "GHS",
        },
        estimatedDelivery: deliveryMethod === "express" ? "1-2 business days" : "3-5 business days",
      }

      const orderPayload = {
        pharmacyId: resolvedPharmacyId,
        totalCost: total,
        discount: 0, // Set to 0 by default
        amountPayable: amountToPay, // Amount to be paid based on payment type
        deliveryMethod: apiDeliveryMethod,
        paymentMethod: apiPaymentMethod, // Mapped payment method
        paymentType: apiPaymentType,
        numberOfItems: totalItemsCount,
        deliveryId: selectedAddressId, // ID of the selected delivery address - required field
        itemList: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      }

      // Ensure deliveryId is included in the payload
      if (!orderPayload.deliveryId) {
        toast.error("Delivery address is required. Please select a delivery address.")
        return
      }

      const order = await createOrder(orderPayload)

      // Clear cart immediately after successful order creation
      await clearCart()

      closeConfirmationDialog()

      // If payment method is online and amount > 0, use Paystack
      if (paymentMethod === "online" && amountToPay > 0) {
        const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
        if (!paystackPublicKey) {
          toast.error("Paystack is not configured. Please contact support.")
          return
        }

        // Ensure amount is a valid number
        const paymentAmount = Number(amountToPay)
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
          toast.error("Invalid payment amount. Please try again.")
          return
        }

        // Generate a unique reference (prefer the order number if available)
        const reference = order.orderNumber || `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // Show loading toast
        const loadingToast = toast.loading("Processing payment...")

        try {
          // Initialize Paystack payment
          await payWithPaystack({
            key: paystackPublicKey,
            email: user.email,
            amount: paymentAmount,
            ref: reference,
            currency: "GHS",
            metadata: {
              order: orderMetadata,
              custom_fields: [
                {
                  display_name: "Order Items",
                  variable_name: "order_items",
                  value: items.map(item => `${item.name} (x${item.quantity})`).join(", "),
                },
              ],
            },
            onSuccess: async (response: any) => {
              toast.dismiss(loadingToast)
              
              // Show verifying payment state
              setIsVerifyingPayment(true)
              toast.loading("Verifying payment...", { id: "verifying-payment" })

              try {
                await createPayment({
                  pharmacyId: resolvedPharmacyId,
                  orderId: order.id,
                  amountPaid: Number(amountToPay) || 0,
                  reference: response?.reference || reference,
                })

                toast.dismiss("verifying-payment")
                toast.success("Payment verified! Order placed successfully!")
                
                // Redirect to marketplace after successful payment record
                setTimeout(() => {
                  router.push("/marketplace")
                }, 1500)
              } catch (error: any) {
                setIsVerifyingPayment(false)
                toast.dismiss("verifying-payment")
                console.error("Error creating payment order after Paystack:", error)
                toast.error(error.message || "Payment captured but failed to record receipt. Please contact support.")
              }
            },
            onClose: () => {
              toast.dismiss(loadingToast)
              toast.error("Payment was cancelled")
            },
            callback: (response: any) => {
              // This is called before onSuccess
              console.log("Paystack callback:", response)
            },
          })
        } catch (error: any) {
          toast.dismiss(loadingToast)
          console.error("Paystack error:", error)
          toast.error(error.message || "Failed to initialize payment")
        }
      } else {
        // For cash on delivery or credit, order is already created and cart is already cleared
        toast.success("Order placed successfully!")

        setTimeout(() => {
          router.push("/orders")
        }, 1500)
      }
    } catch (error: any) {
      console.error("Error in handlePlaceOrder:", error)
      toast.error(error.message || "An error occurred. Please try again.")
    }
  }, [
    selectedAddressId,
    paymentMethod,
    paymentType,
    user,
    addresses,
    installmentPercentage,
    amountPaid,
    total,
    items,
    subtotal,
    deliveryFee,
    tax,
    deliveryMethod,
    remainingBalance,
    createOrder,
    createPayment,
    clearCart,
    closeConfirmationDialog,
    router,
  ])


  // Show skeleton while loading initial data
  if (isInitialLoading) {
    return <CheckoutSkeleton />
  }

  // Show loading overlay when verifying payment
  if (isVerifyingPayment) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">Verifying Payment</h2>
          <p className="text-sm text-gray-600 dark:text-muted-foreground">Please wait while we confirm your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen mt-24 bg-gray-50 dark:bg-background">
      {/* Main Content */}
      <main className="flex-1 py-6 px-4 sm:px-6 items-center justify-center">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/cart"
            className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-foreground dark:hover:text-foreground/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {/* Error Display */}
          {addressError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800 dark:text-red-200">{addressError}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Shipping & Addresses */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Address Form */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">Add Shipping Address</CardTitle>
                    <span className="text-sm text-gray-500 dark:text-muted-foreground">
                      {addresses.length}/5 addresses
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground">
                          Region/City*
                      </label>
                      <input
                        type="text"
                          value={formData.location}
                          onChange={(e) => updateFormData("location", e.target.value)}
                        className="w-full border border-gray-300 dark:border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-background dark:text-foreground"
                          placeholder="Enter region or city (e.g., Greater Accra, Kumasi)"
                          required
                      />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground">
                          Street Address/Location*
                      </label>
                      <input
                        type="text"
                          value={formData.streetAddress}
                          onChange={(e) => updateFormData("streetAddress", e.target.value)}
                        className="w-full border border-gray-300 dark:border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-background dark:text-foreground"
                          placeholder="Enter street address or specific location"
                          required
                      />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground">
                          GPS Coordinates (Optional)
                        </label>
                        <input
                          type="text"
                            value={formData.gpsAddress}
                            onChange={(e) => updateFormData("gpsAddress", e.target.value)}
                          className="w-full border border-gray-300 dark:border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-background dark:text-foreground"
                          placeholder="e.g., 5.6037, -0.1870 or GA-492-9735"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={addresses.length >= 5 || addressLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {addressLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Adding Address...
                          </div>
                        ) : addresses.length >= 5 ? (
                          "Maximum 5 addresses reached"
                        ) : (
                          "Add Address"
                        )}
                      </Button>
                    </form>
                </CardContent>
              </Card>

              {/* Address Cards */}
              {addressLoading && addresses.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">Loading addresses...</span>
                    </div>
                  </CardContent>
                </Card>
              ) : addresses.length > 0 ? (
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg font-semibold">Saved Addresses</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                      {addresses.map((address, index) => (
                        <div 
                          key={address.id} 
                          className={`flex-shrink-0 w-full sm:w-80 border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            selectedAddressId === address.id 
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-md' 
                              : 'border-gray-200 dark:border-border hover:border-emerald-300 dark:hover:border-emerald-600'
                          }`}
                          onClick={() => setSelectedAddress(address.id)}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-emerald-600" />
                              <span className="font-medium text-gray-900 dark:text-foreground">
                                Address {index + 1}
                                {address.isDefault && (
                                  <span className="ml-2 px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                                    Default
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {!address.isDefault && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  disabled={addressLoading}
                                  onClick={async (e) => {
                                    e.stopPropagation()
                                    await setDefaultAddress(address.id)
                                  }}
                                  className="text-xs h-6 px-2"
                                >
                                  {addressLoading ? "..." : "Set Default"}
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={addressLoading}
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  await removeAddress(address.id)
                                }}
                                className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-muted-foreground">Region/City:</span>
                              <span className="font-medium text-gray-900 dark:text-foreground truncate ml-2 max-w-[180px]">
                                {address.location}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-muted-foreground">Address:</span>
                              <span className="font-medium text-gray-900 dark:text-foreground truncate ml-2 max-w-[180px]">
                                {address.streetAddress}
                              </span>
                            </div>
                            {address.gpsAddress && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-muted-foreground">GPS:</span>
                                <span className="font-medium text-gray-900 dark:text-foreground">
                                  {address.gpsAddress}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Address Selection */}
                          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-200 dark:border-border">
                        <input
                          type="radio"
                              name="selected-address"
                              value={address.id}
                              checked={selectedAddressId === address.id}
                              onChange={(e) => {
                                e.stopPropagation()
                                setSelectedAddress(e.target.value)
                              }}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                            <label className="text-sm font-medium text-gray-700 dark:text-foreground">
                              Use for delivery
                      </label>
                          </div>
                          </div>
                      ))}
                        </div>
                    
                    {/* Scroll indicator */}
                    {addresses.length > 1 && (
                      <div className="flex justify-center mt-4">
                        <div className="flex gap-1">
                          {addresses.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                selectedAddressId === addresses[index].id 
                                  ? 'bg-emerald-500' 
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            />
                          ))}
                    </div>
                      </div>
                    )}

                    {/* Delivery Method Selection */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-border">
                      <h3 className="font-semibold text-gray-900 dark:text-foreground mb-3">Delivery Method</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-950/20">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="radio"
                              name="delivery-method"
                              value="normal"
                              checked={deliveryMethod === "normal"}
                              onChange={(e) => setDeliveryMethod(e.target.value as "normal" | "express")}
                              className="sr-only peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 dark:border-border rounded-full bg-white dark:bg-background transition-all duration-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-400"></div>
                    </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-foreground block">Normal Delivery</span>
                            <span className="text-xs text-gray-500 dark:text-muted-foreground">3-5 business days</span>
                          </div>
                        </label>

                        <label className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-950/20">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="radio"
                              name="delivery-method"
                              value="express"
                              checked={deliveryMethod === "express"}
                              onChange={(e) => setDeliveryMethod(e.target.value as "normal" | "express")}
                              className="sr-only peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 dark:border-border rounded-full bg-white dark:bg-background transition-all duration-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-400"></div>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-foreground block">Express Delivery</span>
                            <span className="text-xs text-gray-500 dark:text-muted-foreground">1-2 business days</span>
                      </div>
                        </label>
                    </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-border">
                      <h3 className="font-semibold text-gray-900 dark:text-foreground mb-3">Payment Method</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-950/20">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="radio"
                              name="payment-method"
                              value="online"
                              checked={paymentMethod === "online"}
                              onChange={(e) => handlePaymentMethodChange(e.target.value as "online" | "cash-on-delivery")}
                              className="sr-only peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 dark:border-border rounded-full bg-white dark:bg-background transition-all duration-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-400"></div>
                    </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-foreground block">Online Payment</span>
                            <span className="text-xs text-gray-500 dark:text-muted-foreground">Pay now with card or mobile money</span>
                    </div>
                        </label>

                        <label className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-950/20">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="radio"
                              name="payment-method"
                              value="cash-on-delivery"
                              checked={paymentMethod === "cash-on-delivery"}
                              onChange={(e) => handlePaymentMethodChange(e.target.value as "online" | "cash-on-delivery")}
                              className="sr-only peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 dark:border-border rounded-full bg-white dark:bg-background transition-all duration-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-400"></div>
                    </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-foreground block">Cash on Delivery</span>
                            <span className="text-xs text-gray-500 dark:text-muted-foreground">Pay when you receive your order</span>
                  </div>
                        </label>
                        </div>
                        </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* Payment Type Selection - Commented out for now */}
              {/* <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">Payment Type</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-2">
                      <label className="group flex items-center gap-2 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="payment-type"
                            value="full-payment"
                            checked={paymentType === "full-payment"}
                            onChange={(e) => handlePaymentTypeChange(e.target.value)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 dark:border-border rounded-full bg-white dark:bg-background transition-all duration-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-400"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">Full payment</span>
                      </label>

                      <label className="group flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="payment-type"
                            value="installment-payment"
                            checked={paymentType === "installment-payment"}
                            onChange={(e) => handlePaymentTypeChange(e.target.value)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 dark:border-border rounded-full bg-white dark:bg-background transition-all duration-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-400"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                          Installment payment
                        </span>
                      </label>

                      {paymentType === "installment-payment" && (
                        <div className="ml-8 mt-3 mb-4">
                          <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-foreground">
                            Select Payment Percentage*
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                            {[50, 60, 70, 80, 90].map((percentage) => (
                              <label
                                key={percentage}
                                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-950/20"
                              >
                                <input
                                  type="radio"
                                  name="installment-percentage"
                                  value={percentage}
                                  checked={installmentPercentage === percentage}
                                  onChange={() => setInstallmentPercentage(percentage)}
                                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                                  {percentage}%
                                </span>
                                <span className="text-xs text-gray-500 dark:text-muted-foreground ml-auto">
                                  GH₵ {((total * percentage) / 100).toFixed(2)}
                                </span>
                              </label>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-muted-foreground mt-2">
                            Choose the percentage you want to pay now
                          </p>
                        </div>
                      )}

                      <label className="group flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="payment-type"
                            value="credit"
                            checked={paymentType === "credit"}
                            onChange={(e) => handlePaymentTypeChange(e.target.value)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 dark:border-border rounded-full bg-white dark:bg-background transition-all duration-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-400"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">Credit</span>
                      </label>

                      {paymentType === "credit" && (
                        <div className="ml-8 mt-3 mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Credit Payment Selected</strong>
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                            No immediate payment required. Order will be processed on credit terms.
                          </p>
                        </div>
                      )}
                    </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Right Column - Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 lg:top-6">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">Cart Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Items</span>
                      <span className="font-medium text-gray-900 dark:text-foreground">{totalItems}</span>
                    </div>

                    {/* Items List */}
                    <div className="border-t border-gray-200 dark:border-border pt-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-foreground mb-2">Order Items:</h4>
                      <div className="space-y-1">
                        {items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-muted-foreground">
                              {item.name} (x{item.quantity})
                            </span>
                            <span className="font-medium text-gray-900 dark:text-foreground">
                              GH₵ {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-foreground">GH₵ {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Delivery Fee ({deliveryFeePercentage}%)</span>
                      <span className="font-medium text-gray-900 dark:text-foreground">GH₵ {deliveryFee.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">VAT ({taxPercentage}%)</span>
                      <span className="font-medium text-gray-900 dark:text-foreground">GH₵ {tax.toFixed(2)}</span>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-border flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-foreground">Total</span>
                      <span className="font-bold text-lg text-gray-900 dark:text-foreground">
                        GH₵ {total.toFixed(2)}
                      </span>
                    </div>

                    {/* Installment Payment Breakdown */}
                    {paymentType === "installment-payment" && installmentPercentage > 0 && (
                      <div className="pt-4 border-t border-gray-200 dark:border-border space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-foreground">Amount to Pay Now ({installmentPercentage}%)</span>
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            GH₵ {amountPaid.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-foreground">Remaining Balance</span>
                          <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                            GH₵ {remainingBalance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Credit Payment Notice */}
                    {paymentType === "credit" && (
                      <div className="pt-4 border-t border-gray-200 dark:border-border">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-foreground">Payment Type</span>
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Credit
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-muted-foreground mt-1">
                          No immediate payment required
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                    className="w-full font-semibold py-3 mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={
                        totalItems === 0 ||
                        !total ||
                      !selectedAddressId ||
                      !paymentMethod
                      }
                      onClick={handleContinueToPayment}
                    >
                    Place Order
                    </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Confirm Order Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Cart Summary */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-foreground mb-3">Cart Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-muted-foreground">Items ({totalItems})</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                    {items.map((item) => `${item.name} (x${item.quantity})`).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-muted-foreground">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-foreground">GH₵ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-muted-foreground">Delivery Fee ({deliveryFeePercentage}%)</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-foreground">GH₵ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-muted-foreground">VAT ({taxPercentage}%)</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-foreground">GH₵ {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-border">
                  <span className="font-semibold text-gray-900 dark:text-foreground">Total</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-foreground">GH₵ {total.toFixed(2)}</span>
                </div>
                
                {/* Amount Payable Based on Payment Type - Hidden for now */}
                {/* {paymentType === "installment-payment" && installmentPercentage > 0 && (
                  <>
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-border">
                      <span className="text-sm font-medium text-gray-900 dark:text-foreground">Amount to Pay Now ({installmentPercentage}%)</span>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        GH₵ {amountPaid.toFixed(2)}
                      </span>
              </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-foreground">Remaining Balance</span>
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        GH₵ {remainingBalance.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                
                {paymentType === "credit" && (
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-border">
                    <span className="text-sm font-medium text-gray-900 dark:text-foreground">Payment Type</span>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Credit (GH₵ 0.00)
                    </span>
                  </div>
                )} */}
                
                {/* Final Amount Payable */}
                <div className="flex justify-between pt-2 border-t-2 border-gray-300 dark:border-gray-600">
                  <span className="font-bold text-gray-900 dark:text-foreground">Amount Payable</span>
                  <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                    GH₵ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-foreground mb-3">Delivery Method</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-muted-foreground">Method</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                    {deliveryMethod === "express" ? "Express Delivery" : "Normal Delivery"}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-border">
                  <p className="text-xs text-gray-500 dark:text-muted-foreground italic">
                    Delivery fee will be determined by distance and delivery method
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-foreground mb-3">Payment Method</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-muted-foreground">Method</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                    {paymentMethod === "online" ? "Online Payment" : paymentMethod === "cash-on-delivery" ? "Cash on Delivery" : "Not selected"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Type - Hidden for now */}
            {/* <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-foreground mb-3">Payment Type</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-muted-foreground">Type</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                    {paymentType === "full-payment" && "Full Payment"}
                    {paymentType === "installment-payment" && `Installment Payment (${installmentPercentage}%)`}
                    {paymentType === "credit" && "Credit"}
                  </span>
                </div>
                {paymentType === "installment-payment" && installmentPercentage > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Amount to Pay Now</span>
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        GH₵ {amountPaid.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Remaining Balance</span>
                      <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        GH₵ {remainingBalance.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div> */}

            {/* Pharmacy Details */}
            {user && (() => {
              const pharmacyObj = typeof user.pharmacy === 'object' ? user.pharmacy : null
              const pharmacyDetails = {
                pharmacyName: pharmacyObj?.pharmacy || user.businessName || `${user.firstName} ${user.lastName}`,
                location: pharmacyObj?.location || user.location || "",
                licenceNumber: pharmacyObj?.licenceNumber || user.licenceNumber || "",
                branch: pharmacyObj?.branch || user.branch,
                region: pharmacyObj?.region || "",
                city: pharmacyObj?.city || "",
              }
              
              return (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-foreground mb-3">Pharmacy Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Pharmacy Name</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-foreground">{pharmacyDetails.pharmacyName}</span>
                    </div>
                    {pharmacyDetails.location && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-muted-foreground">Location</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">{pharmacyDetails.location}</span>
                      </div>
                    )}
                    {pharmacyDetails.region && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-muted-foreground">Region</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">{pharmacyDetails.region}</span>
                      </div>
                    )}
                    {pharmacyDetails.city && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-muted-foreground">City</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">{pharmacyDetails.city}</span>
                      </div>
                    )}
                    {pharmacyDetails.licenceNumber && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-muted-foreground">Licence Number</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">{pharmacyDetails.licenceNumber}</span>
                      </div>
                    )}
                    {pharmacyDetails.branch && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-muted-foreground">Branch</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">{pharmacyDetails.branch}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* Selected Address */}
            {selectedAddress && (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-foreground mb-3">Delivery Address</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-muted-foreground">Region/City</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-foreground">{selectedAddress.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-muted-foreground">Address</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-foreground">{selectedAddress.streetAddress}</span>
                  </div>
                  {selectedAddress.gpsAddress && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">GPS Coordinates</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-foreground">{selectedAddress.gpsAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dialog Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeConfirmationDialog}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
