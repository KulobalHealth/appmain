"use client"

import {
  CircleUserRound,
  Home,
  Tag,
  ShoppingBasket,
  LucidePersonStanding,
  Store,
  Building2,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  LogOut,
  Settings,
  Lock,
  X,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { useState, useMemo } from "react"
import { useAuthStore } from "@/store/auth-store"

interface SubMenuItem {
  title: string
  url: string
  requiresSubscription?: boolean
}

interface NavItem {
  title: string
  url: string
  icon: any
  subItems?: SubMenuItem[]
  requiresSubscription?: boolean
}

const allNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    requiresSubscription: true,
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: Store,
    requiresSubscription: false,
    subItems: [
      {
        title: "Browse Products",
        url: "/marketplace",
        requiresSubscription: false,
      },
      {
        title: "Purchase History",
        url: "/orders",
        requiresSubscription: false,
      },
    ],
  },
  {
    title: "Patients",
    url: "/patients",
    icon: LucidePersonStanding,
    requiresSubscription: false,
  },
  {
    title: "Store",
    url: "/store",
    icon: Building2,
    requiresSubscription: true,
  },
  {
    title: "WhatsApp Orders",
    url: "/whatsapp-orders",
    icon: MessageCircle,
    requiresSubscription: true,
  },
  {
    title: "Subscriptions",
    url: "/subscriptions",
    icon: Tag,
    requiresSubscription: false,
  },
]

const bottomNavItems = [
  {
    title: "Account",
    url: "/account",
    icon: CircleUserRound,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [openDropdowns, setOpenDropdowns] = useState<string[]>(['Marketplace'])
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const { user } = useAuthStore()
  
  // Check if user has an active subscription
  const hasActiveSubscription = useMemo(() => {
    return user?.currentSubscription?.active === true
  }, [user?.currentSubscription])

  const toggleDropdown = (title: string) => {
    setOpenDropdowns(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  const handleLockedClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowSubscribeModal(true)
  }

  const isItemActive = (item: NavItem) => {
    if (item.subItems) {
      return item.subItems.some(sub => pathname === sub.url || pathname.startsWith(sub.url + '/'))
    }
    return pathname === item.url || pathname.startsWith(item.url + '/')
  }

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] bg-white flex flex-col border-r border-gray-200">
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-100">
          <Image 
            src="/logo.webp" 
            alt="Kulobal Health" 
            width={200} 
            height={40} 
            className="w-full h-auto max-h-10 object-contain"
          />
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="mb-2 px-3">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Menu</span>
          </div>
          <ul className="space-y-1">
            {allNavItems.map((item) => {
              const isActive = isItemActive(item)
              const hasSubItems = item.subItems && item.subItems.length > 0
              const isOpen = openDropdowns.includes(item.title)
              const isLocked = item.requiresSubscription && !hasActiveSubscription

              if (hasSubItems) {
                return (
                  <li key={item.title}>
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className={clsx(
                        "w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <item.icon
                        className={clsx(
                          "w-5 h-5 flex-shrink-0 transition-colors duration-200",
                          isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"
                        )}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      <span 
                        className={clsx(
                          "text-sm font-medium transition-colors duration-200",
                          isActive ? "text-emerald-600" : "text-gray-600 group-hover:text-gray-900"
                        )}
                      >
                        {item.title}
                      </span>
                      <ChevronDown 
                        className={clsx(
                          "w-4 h-4 ml-auto transition-transform duration-200",
                          isActive ? "text-emerald-500" : "text-gray-400",
                          isOpen && "rotate-180"
                        )} 
                      />
                    </button>
                    {isOpen && (
                      <ul className="mt-1 ml-4 pl-4 border-l border-gray-200 space-y-1">
                        {item.subItems?.map((subItem) => {
                          const isSubActive = pathname === subItem.url || pathname.startsWith(subItem.url + '/')
                          return (
                            <li key={subItem.title}>
                              <Link
                                href={subItem.url}
                                className={clsx(
                                  "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                                  isSubActive
                                    ? "bg-emerald-50 text-emerald-600 font-medium"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              }

              // Locked item (requires subscription)
              if (isLocked) {
                return (
                  <li key={item.title}>
                    <button
                      onClick={handleLockedClick}
                      className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-400 hover:bg-gray-50 cursor-not-allowed"
                    >
                      <item.icon
                        className="w-5 h-5 flex-shrink-0 text-gray-300"
                        strokeWidth={1.5}
                      />
                      <span className="text-sm font-medium text-gray-400">
                        {item.title}
                      </span>
                      <Lock className="w-4 h-4 ml-auto text-gray-300" />
                    </button>
                  </li>
                )
              }

              return (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    className={clsx(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={clsx(
                        "w-5 h-5 flex-shrink-0 transition-colors duration-200",
                        isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"
                      )}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    <span 
                      className={clsx(
                        "text-sm font-medium transition-colors duration-200",
                        isActive ? "text-emerald-600" : "text-gray-600 group-hover:text-gray-900"
                      )}
                    >
                      {item.title}
                    </span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto text-emerald-500" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 p-3">
          <ul className="space-y-1">
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.url
              return (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    className={clsx(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={clsx(
                        "w-5 h-5 flex-shrink-0 transition-colors duration-200",
                        isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"
                      )}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    <span 
                      className={clsx(
                        "text-sm font-medium transition-colors duration-200",
                        isActive ? "text-emerald-600" : "text-gray-600 group-hover:text-gray-900"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* User Profile Card */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user?.firstName?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {hasActiveSubscription ? 'Subscribed' : 'Free Plan'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
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
