"use client"

import { useState, useEffect } from "react"
import { Check, Crown, Medal, Award, Loader2, Calendar, Clock, ChevronDown, ChevronUp, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuthStore } from "@/store/auth-store"
import { payWithPaystack } from "@/lib/paystack"

// Types
interface SubscriptionDetails {
  packageId: string
  startDate: string
  endDate: string
  active: boolean
  durationMonths: number
  amountPaid: number
  paymentDate: string
}

interface PackageInfo {
  packageName: string
  packageId: string
  cost: number
  feature: string[]
}

interface CurrentSubscriptionData {
  hasActiveSubscription: boolean
  currentSubscription: SubscriptionDetails | null
  package: PackageInfo | null
}

interface BalanceResponse {
  balance?: number
  remainingBalance?: number
  daysRemaining?: number
}

interface HistoryItem {
  _id?: string
  id?: string
  packageId: string
  packageName: string
  cost?: number
  amount?: number
  date?: string
  createdAt?: string
  status?: string
}

// Package icons
const getPackageIcon = (packageId?: string) => {
  if (!packageId) return <Medal className="w-5 h-5" />
  const key = packageId.toLowerCase()
  if (key === "gold") return <Crown className="w-5 h-5" />
  if (key === "silver") return <Award className="w-5 h-5" />
  return <Medal className="w-5 h-5" />
}

const getPackageColor = (packageId?: string) => {
  if (!packageId) return "emerald"
  const key = packageId.toLowerCase()
  if (key === "gold") return "amber"
  if (key === "silver") return "slate"
  return "orange"
}

export default function SubscriptionsPage() {
  const { user } = useAuthStore()
  const [subscriptionData, setSubscriptionData] = useState<CurrentSubscriptionData | null>(null)
  const [availablePackages, setAvailablePackages] = useState<PackageInfo[]>([])
  const [balance, setBalance] = useState<BalanceResponse | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingPackage, setIsChangingPackage] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  
  // Get pharmacyId from user
  const pharmacyId = user?.pharmacyId || (typeof user?.pharmacy === "string" ? user?.pharmacy : user?.pharmacy?.pharmacyId)

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    setIsLoading(true)
    try {
      const [currentRes, packagesRes, balanceRes, historyRes] = await Promise.allSettled([
        axios.get('/api/subscription/current', { withCredentials: true }),
        axios.get('/api/subscription/packages', { withCredentials: true }),
        axios.get('/api/subscription/balance', { withCredentials: true }),
        axios.get('/api/subscription/history', { withCredentials: true })
      ])

      // Process current subscription
      if (currentRes.status === "fulfilled") {
        const responseData = currentRes.value.data
        const data = responseData?.data || responseData
        
        setSubscriptionData({
          hasActiveSubscription: data?.hasActiveSubscription ?? data?.currentSubscription?.active ?? false,
          currentSubscription: data?.currentSubscription || null,
          package: data?.package || null
        })
      }

      // Process packages
      if (packagesRes.status === "fulfilled") {
        const data = packagesRes.value.data?.data || []
        setAvailablePackages(Array.isArray(data) ? data : [])
      }

      // Process balance
      if (balanceRes.status === "fulfilled" && balanceRes.value.data?.data) {
        setBalance(balanceRes.value.data.data)
      }

      // Process history
      if (historyRes.status === "fulfilled") {
        const data = historyRes.value.data?.data || historyRes.value.data?.history || []
        setHistory(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectPackage = async (newPackageId: string) => {
    const currentPackageId = subscriptionData?.package?.packageId || subscriptionData?.currentSubscription?.packageId
    if (!newPackageId || newPackageId === currentPackageId) return

    if (!pharmacyId) {
      toast.error("Unable to determine pharmacy ID")
      return
    }

    // Validate user email for Paystack
    const userEmail = user?.email
    if (!userEmail) {
      toast.error("User email not found. Please log in again.")
      return
    }

    // Validate Paystack key
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    if (!paystackKey) {
      toast.error("Payment configuration error. Please contact support.")
      console.error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not configured")
      return
    }

    // Find the new package to get its cost
    const newPkg = availablePackages.find(p => p.packageId === newPackageId)
    if (!newPkg) {
      toast.error("Package not found")
      return
    }

    // Calculate amount needed (package cost)
    const amountNeeded = newPkg.cost
    
    if (!amountNeeded || amountNeeded <= 0) {
      toast.error("Invalid package price")
      return
    }

    setIsChangingPackage(true)

    // Generate payment reference
    const paymentRef = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    try {
      console.log('[Subscription] Starting Paystack payment for package:', newPackageId)
      await payWithPaystack({
        key: paystackKey,
        email: userEmail,
        amount: amountNeeded,
        ref: paymentRef,
        metadata: {
          pharmacyId,
          packageId: newPackageId,
          type: "subscription_enroll"
        },
        onSuccess: async (response) => {
          // Payment successful, now enroll in the package
          console.log('[Subscription] Payment successful, enrolling...', response)
          try {
            const enrollResponse = await axios.post('/api/subscription/enroll', { 
              packageId: newPackageId,
              duration: 1,
              amountPaid: amountNeeded,
              reference: response.reference,
              pharmacyId
            }, { withCredentials: true })
            
            console.log('[Subscription] Enroll response:', enrollResponse.data)
            
            if (enrollResponse.data?.status === "success") {
              toast.success(`Successfully subscribed to ${newPkg.packageName}!`)
              fetchSubscriptionData()
            } else {
              toast.error(enrollResponse.data?.message || "Failed to activate subscription")
            }
          } catch (error: any) {
            console.error('[Subscription] Enroll error:', error)
            toast.error(error.response?.data?.message || "Failed to activate subscription")
          } finally {
            setIsChangingPackage(false)
          }
        },
        onClose: () => {
          console.log('[Subscription] Payment modal closed')
          toast.error("Payment cancelled")
          setIsChangingPackage(false)
        }
      })
    } catch (error: any) {
      console.error('[Subscription] Paystack init error:', error)
      toast.error("Failed to initialize payment")
      setIsChangingPackage(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Derived values
  const hasActiveSubscription = subscriptionData?.hasActiveSubscription || false
  const currentPackage = subscriptionData?.package || null
  const subscriptionDetails = subscriptionData?.currentSubscription || null
  const currentPackageId = currentPackage?.packageId || subscriptionDetails?.packageId
  const daysRemaining = balance?.daysRemaining || 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Subscription</h1>
        <p className="text-gray-500 mt-1">Manage your subscription plan</p>
      </div>

      {/* Current Plan Card */}
      {hasActiveSubscription && currentPackage ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                getPackageColor(currentPackageId) === "amber" ? "bg-amber-100 text-amber-600" :
                getPackageColor(currentPackageId) === "slate" ? "bg-slate-100 text-slate-600" :
                "bg-orange-100 text-orange-600"
              }`}>
                {getPackageIcon(currentPackageId)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{currentPackage.packageName}</h2>
                  <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">Active</span>
                </div>
                <p className="text-gray-500 text-sm mt-0.5">GHS {currentPackage.cost}/month</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{daysRemaining}</div>
              <p className="text-xs text-gray-500">days left</p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Started {formatDate(subscriptionDetails?.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Renews {formatDate(subscriptionDetails?.endDate)}</span>
            </div>
          </div>

          {/* Features */}
          {currentPackage.feature && currentPackage.feature.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Included Features</p>
              <div className="grid grid-cols-2 gap-2">
                {currentPackage.feature.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Medal className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No Active Subscription</h3>
          <p className="text-gray-500 text-sm mt-1">Choose a plan below to get started</p>
        </div>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {hasActiveSubscription ? "Change Plan" : "Choose a Plan"}
        </h2>
        
        <div className="grid gap-4">
          {availablePackages.map((pkg) => {
            const isCurrentPlan = pkg.packageId?.toLowerCase() === currentPackageId?.toLowerCase()
            const color = getPackageColor(pkg.packageId)
            
            return (
              <div
                key={pkg.packageId}
                className={`bg-white rounded-xl border-2 p-5 transition-all ${
                  isCurrentPlan 
                    ? "border-emerald-500 bg-emerald-50/30" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      color === "amber" ? "bg-amber-100 text-amber-600" :
                      color === "slate" ? "bg-slate-100 text-slate-600" :
                      "bg-orange-100 text-orange-600"
                    }`}>
                      {getPackageIcon(pkg.packageId)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{pkg.packageName}</h3>
                        {isCurrentPlan && (
                          <span className="text-xs text-emerald-600 font-medium">Current</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">GHS {pkg.cost}/month</p>
                    </div>
                  </div>

                  {!isCurrentPlan && (
                    <Button
                      size="sm"
                      onClick={() => handleSelectPackage(pkg.packageId)}
                      disabled={isChangingPackage}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isChangingPackage ? <Loader2 className="w-4 h-4 animate-spin" /> : "Select"}
                    </Button>
                  )}
                </div>

                {/* Features preview */}
                {pkg.feature && pkg.feature.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {pkg.feature.slice(0, 3).map((feat, idx) => (
                        <span key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {feat}
                        </span>
                      ))}
                      {pkg.feature.length > 3 && (
                        <span className="text-xs text-gray-400">+{pkg.feature.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Billing History */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-gray-900">Billing History</h3>
              <p className="text-sm text-gray-500">{history.length} transaction{history.length !== 1 ? "s" : ""}</p>
            </div>
            {showHistory ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {showHistory && (
            <div className="border-t border-gray-100">
              {history.map((item, index) => (
                <div
                  key={item._id || item.id || index}
                  className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {getPackageIcon(item.packageId)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.packageName}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.date || item.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">GHS {item.cost || item.amount || 0}</p>
                    <p className={`text-xs ${item.status === "completed" || item.status === "success" ? "text-emerald-600" : "text-gray-500"}`}>
                      {item.status || "Completed"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}




