"use client"

import { useEffect, useState } from "react"
import { CheckCircle, ShoppingCart } from "lucide-react"

interface CartNotificationProps {
  show: boolean
  productName: string
  message?: string
  onClose: () => void
}

export function CartNotification({ show, productName, message = "Added to cart!", onClose }: CartNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white border border-green-200 rounded-xl shadow-lg p-4 flex items-center gap-3 min-w-[300px]">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{message}</p>
          <p className="text-sm text-gray-600 truncate">{productName}</p>
        </div>
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-4 h-4 text-emerald-600" />
        </div>
      </div>
    </div>
  )
}
