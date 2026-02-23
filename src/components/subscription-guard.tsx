"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { Preloader } from '@/components/preloader'
import { Lock, X } from 'lucide-react'

interface SubscriptionGuardProps {
  children: React.ReactNode
}

// Routes that require an active subscription
const subscriptionRequiredRoutes = [
  '/dashboard',
  '/store',
  '/whatsapp-orders',
]

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [showModal, setShowModal] = useState(false)

  const hasActiveSubscription = user?.currentSubscription?.active === true

  // Check if current route requires subscription
  const requiresSubscription = subscriptionRequiredRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  useEffect(() => {
    // Only check after auth is loaded and user is authenticated
    if (!isLoading && isAuthenticated && requiresSubscription && !hasActiveSubscription) {
      setShowModal(true)
    }
  }, [isLoading, isAuthenticated, requiresSubscription, hasActiveSubscription])

  if (isLoading) {
    return <Preloader />
  }

  // If route requires subscription and user doesn't have one, show modal
  if (requiresSubscription && !hasActiveSubscription && isAuthenticated) {
    return (
      <>
        <Preloader />
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-amber-600" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Subscription Required
              </h3>
              <p className="text-gray-600 text-center mb-6">
                This page requires an active subscription. Please subscribe to a package to access this feature.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/marketplace')}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => router.push('/subscriptions')}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}
