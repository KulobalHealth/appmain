"use client"

import Link from "next/link"
import { useEffect } from "react"
import React from "react"
import { Bell, ShoppingCart, Search, Settings, HelpCircle, ChevronDown, Building2, MapPin, Phone, LogOut, User, Package, CreditCard, Mail, BadgeCheck } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { useAuthStore } from "@/store/auth-store"
import { Input } from "../ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "../ui/dropdown-menu"
import { Pharmacy } from "@/types/user"

export function DashboardNavbar() {
  const { totalItems, fetchCartItems } = useCartStore()
  const { user, isAuthenticated, getProfile, logout } = useAuthStore()

  // Fetch profile if authenticated but user data is not loaded
  useEffect(() => {
    if (isAuthenticated && !user) {
      getProfile()
    }
  }, [isAuthenticated, user, getProfile])

  // Fetch cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems()
    }
  }, [isAuthenticated, fetchCartItems])

  const handleLogout = async () => {
    await logout()
    window.location.href = "/login"
  }

  // Helper to get pharmacy object (handles both string and object)
  const getPharmacyData = (): Partial<Pharmacy> | null => {
    if (!user?.pharmacy) return null
    if (typeof user.pharmacy === "object") {
      return user.pharmacy as Pharmacy
    }
    // If pharmacy is a string, return it as the name
    return { pharmacy: user.pharmacy as string }
  }

  const pharmacyData = getPharmacyData()

  // Get pharmacy name from various possible fields
  const getPharmacyName = () => {
    if (!pharmacyData) return user?.businessName || "My Pharmacy"
    return pharmacyData.pharmacy || user?.businessName || "My Pharmacy"
  }

  // Get pharmacy initials for avatar
  const getPharmacyInitials = () => {
    const name = getPharmacyName()
    const words = name.split(" ").filter(Boolean)
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Get pharmacy location
  const getPharmacyLocation = () => {
    if (pharmacyData?.location) return pharmacyData.location
    if (pharmacyData?.city && pharmacyData?.region) return `${pharmacyData.city}, ${pharmacyData.region}`
    if (pharmacyData?.city) return pharmacyData.city
    if (pharmacyData?.region) return pharmacyData.region
    return user?.location || null
  }

  // Get pharmacy license
  const getPharmacyLicense = () => {
    return pharmacyData?.licenceNumber || user?.licenceNumber || null
  }

  // Get phone number
  const getPhoneNumber = () => {
    return user?.phoneNumber || null
  }

  return (
    <header className="fixed top-0 left-0 md:left-[240px] right-0 z-50 h-14 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section - Search */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md w-full hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search patients, orders, products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg focus:bg-white focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1">
          {/* Help Button */}
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Settings Button */}
          <Link 
            href="/account" 
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>

          {/* Cart */}
          <Link 
            href="/cart" 
            className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-emerald-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 pr-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                  {getPharmacyInitials()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-tight truncate max-w-[140px]">
                    {getPharmacyName()}
                  </p>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    {user?.firstName || "User"} {user?.lastName || ""}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white border-gray-200 text-gray-900 p-0 shadow-lg">
              {/* Pharmacy Info Header */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                    {getPharmacyInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-gray-900 truncate">
                        {getPharmacyName()}
                      </p>
                      {user?.verifiedUser && (
                        <BadgeCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    {getPharmacyLicense() && (
                      <p className="text-xs text-emerald-600 mt-0.5">
                        License: {getPharmacyLicense()}
                      </p>
                    )}
                    {pharmacyData?.pharmacyId && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        ID: {pharmacyData.pharmacyId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pharmacy Details */}
              <div className="p-3 border-b border-gray-200 space-y-2.5">
                {getPharmacyLocation() && (
                  <div className="flex items-start gap-2.5 text-xs text-gray-600">
                    <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{getPharmacyLocation()}</span>
                  </div>
                )}
                {getPhoneNumber() && (
                  <div className="flex items-center gap-2.5 text-xs text-gray-600">
                    <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{getPhoneNumber()}</span>
                  </div>
                )}
                {user?.email && (
                  <div className="flex items-center gap-2.5 text-xs text-gray-600">
                    <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
                {pharmacyData?.region && pharmacyData?.city && (
                  <div className="flex items-center gap-2.5 text-xs text-gray-600">
                    <Building2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{pharmacyData.city}, {pharmacyData.region}</span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="p-3 border-b border-gray-200">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-gray-400 font-medium px-0 py-1">
                  Logged in as
                </DropdownMenuLabel>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[10px] text-gray-500">{user?.role || user?.userType || "Pharmacist"}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 rounded-lg px-3 py-2.5 text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span>Pharmacy Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 rounded-lg px-3 py-2.5 text-gray-700">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscriptions" className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 rounded-lg px-3 py-2.5 text-gray-700">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span>Subscriptions</span>
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-gray-200 m-0" />
              
              {/* Sign Out */}
              <div className="p-2">
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 cursor-pointer text-red-500 hover:bg-red-50 focus:bg-red-50 focus:text-red-500 rounded-lg px-3 py-2.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
