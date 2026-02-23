"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, ArrowLeft, Trash2 } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"
import CartSkeleton from "./cart-skeleton"

export default function CartPage() {
   const { items, updateQuantity, removeItem, totalItems, totalPrice, clearCart, fetchCartItems } = useCartStore()
   const { user } = useAuthStore()
   const [showClearConfirm, setShowClearConfirm] = useState(false)
   const [isLoading, setIsLoading] = useState(true)

   // Fetch cart items on component mount (middleware ensures user is authenticated)
   useEffect(() => {
     const fetch = async () => {
       await fetchCartItems()
       setIsLoading(false)
     }
     fetch()
   }, [fetchCartItems])

  // Show skeleton while fetching cart (auth loading is handled by AuthProvider)
  if (isLoading) {
    return <CartSkeleton />
  }

  // Clear cart confirmation handlers
  const handleClearCart = () => setShowClearConfirm(true)
  const confirmClearCart = async () => {
    const result = await clearCart()
    if (result.success) {
      toast.success("Cart cleared successfully")
    } else {
      toast.error(result.error || "Failed to clear cart")
    }
    setShowClearConfirm(false)
  }
  const cancelClearCart = () => setShowClearConfirm(false)

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-6 bg-white min-h-screen dark:bg-background dark:text-foreground">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6 dark:text-foreground">Add some products to your cart to get started.</p>
          <Link href="/marketplace">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = totalPrice || 0
  const total = subtotal

  return (
    <>
      {/* Clear Cart Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Clear Cart?</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all {totalItems} {totalItems === 1 ? "item" : "items"} from your cart?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmClearCart}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
              >
                Yes, Clear Cart
              </button>
              <button
                onClick={cancelClearCart}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Page */}
      <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen mt-24 dark:bg-background dark:text-foreground">
        <div className="flex items-center justify-between mb-6">
          <Link href="/marketplace" className="inline-flex items-center text-emerald-600 hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 border rounded-2xl">
            <div className="flex items-center justify-between mb-6 border-b p-4">
              <h1 className="text-2xl font-semibold dark:text-foreground">My Cart ({totalItems})</h1>
            </div>
            <div className="space-y-4 px-6 py-4">
              {items.map((item) => (
                <Card key={item.id} className="bg-white dark:bg-card shadow-none overflow-hidden mb-6 dark:border-border">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row min-h-[200px] sm:h-[200px]">
                      {/* Image */}
                      <div className="w-full sm:w-1/3 h-48 sm:h-auto bg-gray-50 dark:bg-muted flex items-center justify-center">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={200}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-400">
                            <span className="text-sm">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="w-full sm:w-2/3 p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex flex-col justify-between flex-1">
                          <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-card-foreground mb-1">
                            {item.product.name}
                          </h3>
                          <div className="text-lg sm:text-xl font-black text-gray-900 dark:text-card-foreground mt-2 sm:hidden">
                            GH₵ {(item.product.price || 0).toFixed(2)}
                          </div>
                          <button
                            onClick={async () => {
                              const result = await removeItem(item.id)
                              if (result.success) {
                                toast.success("Item removed from cart")
                              } else {
                                toast.error(result.error || "Failed to remove item")
                              }
                            }}
                            className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 text-sm font-medium underline mt-2"
                          >
                            Remove from cart
                          </button>
                        </div>

                        {/* Quantity & Price */}
                        <div className="w-full sm:w-[40%] flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-10">
                          <div className="text-lg sm:text-xl font-black text-gray-900 dark:text-card-foreground hidden sm:block">
                            GH₵ {(item.product.price || 0).toFixed(2)}
                          </div>
                          <div className="flex items-center bg-gray-200 dark:bg-muted rounded-full border p-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-muted-foreground/10 bg-gray-50 dark:bg-muted-foreground/5"
                              onClick={async () => {
                                const result = await updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                                if (!result.success) {
                                  toast.error(result.error || "Failed to update quantity")
                                }
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 min-w-[3rem] text-center font-medium dark:text-card-foreground">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 rounded-full hover:bg-gray-100 bg-gray-50 dark:text-background"
                              onClick={async () => {
                                const result = await updateQuantity(item.id, item.quantity + 1)
                                if (!result.success) {
                                  toast.error(result.error || "Failed to update quantity")
                                }
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 lg:top-6">
              <div className="border-b p-4">
                <h2 className="text-lg font-semibold dark:text-foreground">Cart Summary</h2>
              </div>
              <CardContent className="space-y-4 p-6 dark:text-foreground">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-foreground">Items</span>
                  <span className="font-semibold dark:text-foreground">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-foreground">Subtotal</span>
                  <span className="font-semibold dark:text-foreground">₵ {(subtotal || 0).toFixed(2)}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold dark:text-foreground">Total</span>
                  <span className="font-bold dark:text-foreground">₵ {(total || 0).toFixed(2)}</span>
                </div>
                <div className="flex gap-3 mt-6">
                  <Link href="/checkout">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3">
                      Continue to checkout
                    </Button>
                  </Link>
                  <Button
                    onClick={handleClearCart}
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600 dark:hover:bg-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Items
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
