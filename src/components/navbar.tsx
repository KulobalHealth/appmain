"use client"

import Link from "next/link"
import Image from "next/image"
import { Bell, ShoppingCart, Menu, X, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import clsx from "clsx"
import { ModeToggle } from "./ui/mode-toggle"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { useAuthStore } from "@/store/auth-store"
import Profile from "./auth/account-dropdown"
import { useCartStore } from "@/store/cart-store"

const solutions = [
  { name: "For Pharmacies", href: "/pharmacies", description: "Source medical supplies effortlessly." },
  { name: "For Suppliers", href: "/suppliers", description: "Expand your reach across Ghana." },
  { name: "Detection", href: "/detection", description: "AI-powered counterfeit detection." },
  { name: "About Us", href: "/about-us", description: "Learn more about Kulobal Health." },
]

const navigationLinks = [
  { name: "Marketplace", href: "/marketplace" },
  { name: "Pricing", href: "/pricing" },
]

// Dashboard routes that should not show the main navbar
const dashboardRoutes = [
  "/dashboard",
  "/patients",
  "/account",
  "/orders",
  "/subscriptions",
  "/ddi",
  "/prescriptions",
  "/store",
  "/whatsapp-orders",
]

export function Navbar() {
  const { user, isAuthenticated, isLoading, initializeAuth } = useAuthStore()
  const { totalItems, items: cart, fetchCartItems } = useCartStore()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false)
  const isActive = (href: string) => pathname === href

  // Don't render navbar on dashboard routes
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route))
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSolutionsOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Fetch cart items once user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCartItems()
    }
  }, [isAuthenticated, user, fetchCartItems])

  // Don't render on dashboard routes
  if (isDashboardRoute) {
    return null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-background transition duration-300 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 mx-auto max-w-7xl">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" prefetch className="text-2xl font-bold text-emerald-500">
            <Image
              src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1766605935/logo_xkdsfz.webp"
              alt="KulobalHealth"
              width={180}
              height={180}
              className="w-[140px] h-auto md:w-[180px] transition-transform duration-300 hover:brightness-110"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="items-center hidden lg:flex space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={clsx(
                    "transition-colors duration-300 hover:text-primary-700 dark:hover:text-primary-400",
                    { "text-primary-600 font-semibold dark:text-primary-400": ["/pharmacies", "/suppliers", "/detection", "/about-us"].includes(pathname) }
                  )}
                >
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[600px] md:grid-cols-2">
                    {solutions.map(item => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className={clsx(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                              { "bg-accent": isActive(item.href) }
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {navigationLinks.map(item => (
            <Link
              key={item.name}
              prefetch
              href={item.href}
              className={clsx("transition-colors duration-300 hover:text-primary-700 dark:hover:text-primary-400", {
                "text-primary-600 font-semibold dark:text-primary-400": isActive(item.href),
                "text-neutral-800 dark:text-white": !isActive(item.href),
              })}
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/contact"
            prefetch
            className={clsx("transition-colors duration-300 hover:text-primary-700 dark:hover:text-primary-400", {
              "text-primary-600 font-semibold dark:text-primary-400": isActive("/contact"),
              "text-neutral-800 dark:text-white": !isActive("/contact"),
            })}
          >
            Contact Us
          </Link>
        </div>

        {/* Right-side */}
        <div className="flex text-neutral-800 items-center space-x-2 md:space-x-4">
          {!isLoading && isAuthenticated && user ? (
            <>
              <Profile />

              <div className="relative">
                <Link href="/cart">
                  <ShoppingCart className="cursor-pointer hover:text-emerald-500 transition-colors w-5 h-5 md:w-6 md:h-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
              <Bell className="cursor-pointer hover:text-primary-700 transition-colors w-5 h-5 md:w-6 md:h-6 hidden md:block" />
            </>
          ) : (
            <>
              <Link prefetch href="/login" className="hidden md:block">
                <Button variant="ghost" className="hover:text-primary-700">
                  Login
                </Button>
              </Link>
              <Link prefetch href="/signup" target="_blank" className="hidden md:block">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Create Account
                </Button>
              </Link>
            </>
          )}
          <div className="hidden md:block">
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-800 dark:text-white hover:text-primary-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-white dark:bg-gray-900 z-40 overflow-y-auto">
          <div className="flex flex-col p-6 space-y-4">
            {/* Solutions Dropdown */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <button
                onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <span>Solutions</span>
                <ChevronDown className={clsx("w-5 h-5 transition-transform", { "rotate-180": isSolutionsOpen })} />
              </button>
              {isSolutionsOpen && (
                <div className="mt-4 ml-4 space-y-3">
                  {solutions.map(item => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        "block p-3 rounded-lg transition-colors",
                        {
                          "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400": isActive(item.href),
                          "hover:bg-gray-50 dark:hover:bg-gray-800": !isActive(item.href)
                        }
                      )}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            {navigationLinks.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "block py-3 px-4 rounded-lg font-medium transition-colors border-b border-gray-200 dark:border-gray-700",
                  {
                    "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400": isActive(item.href),
                    "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800": !isActive(item.href)
                  }
                )}
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/contact"
              className={clsx(
                "block py-3 px-4 rounded-lg font-medium transition-colors border-b border-gray-200 dark:border-gray-700",
                {
                  "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400": isActive("/contact"),
                  "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800": !isActive("/contact")
                }
              )}
            >
              Contact Us
            </Link>

            {/* Auth Buttons for Mobile */}
            {!isAuthenticated && (
              <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" target="_blank" className="block">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}

            {/* Mode Toggle for Mobile */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white font-medium">Theme</span>
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
