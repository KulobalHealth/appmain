"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, AlertCircle, Info, type LucideIcon } from "lucide-react"

type NotificationType = "success" | "error" | "warning" | "info"

interface NotificationProps {
  show: boolean
  type?: NotificationType
  title: string
  message?: string
  duration?: number
  icon?: LucideIcon
  onClose: () => void
}

const notificationStyles = {
  success: {
    container: "bg-white border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
    defaultIcon: CheckCircle,
  },
  error: {
    container: "bg-white border-red-200",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
    defaultIcon: XCircle,
  },
  warning: {
    container: "bg-white border-yellow-200",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
    defaultIcon: AlertCircle,
  },
  info: {
    container: "bg-white border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
    defaultIcon: Info,
  },
}

export function Notification({
  show,
  type = "success",
  title,
  message,
  duration = 3000,
  icon,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  const styles = notificationStyles[type]
  const IconComponent = icon || styles.defaultIcon

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, onClose, duration])

  if (!show) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`${styles.container} border rounded-xl shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-[400px]`}
      >
        <div className={`w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
          <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${styles.titleColor}`}>{title}</p>
          {message && <p className={`text-sm ${styles.messageColor} break-words`}>{message}</p>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
