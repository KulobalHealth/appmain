"use client"

import { Trash2 } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { useAuthStore } from "@/store/auth-store"
import { useState, useEffect } from "react"

export function FloatingCartButton() {
  const { totalItems, clearCart, items, fetchCartItems } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [showConfirm, setShowConfirm] = useState(false)

  // Fetch cart items from backend when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("FloatingCartButton - Fetching cart items from backend")
      fetchCartItems()
    }
  }, [isAuthenticated, fetchCartItems])

  // Don't show floating cart button if user is not authenticated OR if cart is empty
  if (!isAuthenticated) return null
  if (totalItems === 0 || items.length === 0) return null

  const handleClearCart = () => {
    setShowConfirm(true)
  }

  const confirmClearCart = () => {
    clearCart()
    setShowConfirm(false)
  }

  const cancelClearCart = () => {
    setShowConfirm(false)
  }

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Clear Cart?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove all {totalItems} {totalItems === 1 ? "item" : "items"} from your cart?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmClearCart}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Clear Cart
              </button>
              <button
                onClick={cancelClearCart}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      <div className="fixed bottom-4 left-4 z-40 md:hidden">
        <button
          onClick={handleClearCart}
          className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <div className="relative">
            <Trash2 className="w-6 h-6 text-white" />
            <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          </div>
        </button>
      </div>
    </>
  )
}
