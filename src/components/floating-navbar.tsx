"use client"

import Link from "next/link"
import { Home, Search, ShoppingCart, LayoutDashboard, User, Users, Lock, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { useAuthStore } from "@/store/auth-store"
import { useCartStore } from "@/store/cart-store"
import { useMemo, useState } from "react"

interface NavItem {
  name: string
  href: string
  icon: any
  showBadge?: boolean
  requireAuth?: boolean
  requiresSubscription?: boolean
}

const navigationItems: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    icon: Search,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: ShoppingCart,
    showBadge: true,
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Users,
    requireAuth: true,
    requiresSubscription: false,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    requireAuth: true,
    requiresSubscription: true,
  },
  {
    name: "Profile",
    href: "/account",
    icon: User,
    requireAuth: true,
  },
]

export function FloatingBottomNavbar() {
  const { totalItems } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)

  // Check if user has an active subscription
  const hasActiveSubscription = useMemo(() => {
    return user?.currentSubscription?.active === true
  }, [user?.currentSubscription])

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  // Filter items based on authentication only (show locked items)
  const visibleItems = useMemo(() => {
    return navigationItems.filter((item) => {
      // Check auth requirement
      if (item.requireAuth && !isAuthenticated) return false
      return true
    })
  }, [isAuthenticated])

  const handleLockedClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowSubscribeModal(true)
  }

  // Don't show if not authenticated and no items to show
  if (!isAuthenticated && visibleItems.length === 0) {
    return null
  }

  return (
    <>
      {/* Bottom padding to prevent content overlap */}
      <div className="h-16 md:hidden" />

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <nav className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/40 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30">
          <div className="px-2 py-1.5">
            <div className="flex items-center gap-1">
              {visibleItems.map((item) => {
                const isItemActive = isActive(item.href)
                const Icon = item.icon
                const isLocked = item.requiresSubscription && !hasActiveSubscription

                if (isLocked) {
                  return (
                    <button
                      key={item.name}
                      onClick={handleLockedClick}
                      className="relative flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 ease-out min-w-0 group opacity-50"
                    >
                      <div className="relative mb-0.5">
                        <Icon className="h-5 w-5 text-gray-400" />
                        <Lock className="absolute -top-1 -right-1 h-3 w-3 text-gray-400" />
                      </div>
                      <span className="text-[10px] font-medium leading-tight text-gray-400">
                        {item.name}
                      </span>
                    </button>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "relative flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 ease-out min-w-0 group",
                      "hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40",
                      "active:scale-95",
                      {
                        "bg-emerald-500/15 dark:bg-emerald-500/25": isItemActive,
                      },
                    )}
                  >
                    {/* Icon Container */}
                    <div className="relative mb-0.5">
                      <Icon
                        className={clsx("h-5 w-5 transition-all duration-200 ease-out", {
                          "text-emerald-600 dark:text-emerald-400": isItemActive,
                          "text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400":
                            !isItemActive,
                        })}
                      />

                      {/* Cart Badge */}
                      {item.showBadge && totalItems > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-md ring-2 ring-white dark:ring-gray-900">
                          {totalItems > 99 ? "99+" : totalItems}
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={clsx("text-[10px] font-medium leading-tight transition-all duration-200 ease-out", {
                        "text-emerald-600 dark:text-emerald-400": isItemActive,
                        "text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400":
                          !isItemActive,
                      })}
                    >
                      {item.name}
                    </span>

                    {/* Active Indicator */}
                    {isItemActive && (
                      <div className="absolute inset-0 rounded-xl ring-1 ring-emerald-500/30 dark:ring-emerald-400/30" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSubscribeModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={() => setShowSubscribeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Feature Locked
            </h3>
            <p className="text-gray-600 text-center mb-6">
              This feature requires an active subscription. Subscribe to a package to unlock all features.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubscribeModal(false)
                  router.push('/subscriptions')
                }}
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
