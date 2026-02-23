"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, HelpCircle, BarChart3, Users, Zap, FileText, Package, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GuideStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  target: string
  position: "top" | "bottom" | "left" | "right"
}

const guideSteps: GuideStep[] = [
  {
    id: 1,
    title: "Welcome to Your Dashboard",
    description: "This is your central hub for managing your pharmacy. Let's take a quick tour of the main features.",
    icon: <HelpCircle className="w-6 h-6" />,
    target: "header",
    position: "bottom"
  },
  {
    id: 2,
    title: "Statistics Overview",
    description: "View key metrics at a glance - total patients, orders, monthly revenue, and pending orders. These cards update in real-time.",
    icon: <BarChart3 className="w-6 h-6" />,
    target: "stats",
    position: "bottom"
  },
  {
    id: 3,
    title: "Quick Actions",
    description: "Access frequently used features quickly - create prescriptions, conduct rapid tests, or register new patients with just one click.",
    icon: <Zap className="w-6 h-6" />,
    target: "quick-actions",
    position: "top"
  },
  {
    id: 4,
    title: "Recent Transactions",
    description: "Track your latest orders and transactions. See payment status, order details, and time since the order was placed.",
    icon: <FileText className="w-6 h-6" />,
    target: "transactions",
    position: "right"
  },
  {
    id: 5,
    title: "Order Statistics",
    description: "Monitor your order pipeline - see pending, processing, shipped, and delivered orders at a glance with visual progress bars.",
    icon: <Activity className="w-6 h-6" />,
    target: "order-stats",
    position: "right"
  },
  {
    id: 6,
    title: "Navigation Sidebar",
    description: "Use the sidebar to navigate between different sections: Patients, Orders, Prescriptions, Store, and more. Click any menu item to explore.",
    icon: <Package className="w-6 h-6" />,
    target: "sidebar",
    position: "right"
  }
]

export function DashboardGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenGuide, setHasSeenGuide] = useState(true)

  useEffect(() => {
    // Check if user has seen the guide before
    const seen = localStorage.getItem("dashboard-guide-seen")
    if (!seen) {
      setHasSeenGuide(false)
      // Auto-open guide for first-time users after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsOpen(false)
    setCurrentStep(0)
    localStorage.setItem("dashboard-guide-seen", "true")
    setHasSeenGuide(true)
  }

  const handleSkip = () => {
    handleComplete()
  }

  const openGuide = () => {
    setCurrentStep(0)
    setIsOpen(true)
  }

  const step = guideSteps[currentStep]
  const progress = ((currentStep + 1) / guideSteps.length) * 100

  return (
    <>
      {/* Help Button - Always visible */}
      <button
        onClick={openGuide}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
        title="Open Dashboard Guide"
      >
        <HelpCircle className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium">
          Help Guide
        </span>
      </button>

      {/* Guide Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Guide Card */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Progress Bar */}
            <div className="h-1 bg-gray-200 dark:bg-gray-700">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg text-green-600 dark:text-green-400">
                  {step.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Step {currentStep + 1} of {guideSteps.length}
                  </p>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {step.description}
              </p>

              {/* Step Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {guideSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? "bg-green-500 w-6" 
                        : index < currentStep 
                          ? "bg-green-300" 
                          : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1 bg-green-600 hover:bg-green-700"
                >
                  {currentStep === guideSteps.length - 1 ? "Finish" : "Next"}
                  {currentStep < guideSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* First-time user prompt */}
      {!hasSeenGuide && !isOpen && (
        <div className="fixed bottom-20 right-6 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 max-w-xs animate-in slide-in-from-bottom fade-in duration-500 border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg text-green-600 flex-shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">New here?</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Take a quick tour to learn about the dashboard features.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={openGuide}
                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition-colors"
                >
                  Start Tour
                </button>
                <button
                  onClick={handleComplete}
                  className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
