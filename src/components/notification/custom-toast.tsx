"use client"

import toast from "react-hot-toast"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"

interface CustomToastProps {
  message: string
  type: "success" | "error" | "warning" | "info"
  icon?: string
}

export const showCustomToast = ({ message, type, icon }: CustomToastProps) => {
  const getIcon = () => {
    if (icon) return icon

    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return null
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800"
      case "error":
        return "text-red-800"
      case "warning":
        return "text-yellow-800"
      case "info":
        return "text-blue-800"
      default:
        return "text-gray-800"
    }
  }

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full ${getBackgroundColor()} shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${getTextColor()}`}>{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            ×
          </button>
        </div>
      </div>
    ),
    {
      duration: type === "error" ? 5000 : 3000,
    },
  )
}

// Convenience functions
export const showSuccessToast = (message: string, icon?: string) => showCustomToast({ message, type: "success", icon })

export const showErrorToast = (message: string, icon?: string) => showCustomToast({ message, type: "error", icon })

export const showWarningToast = (message: string, icon?: string) => showCustomToast({ message, type: "warning", icon })

export const showInfoToast = (message: string, icon?: string) => showCustomToast({ message, type: "info", icon })
