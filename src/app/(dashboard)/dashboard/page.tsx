"use client"

import StatCard from "@/components/dashbord/stats-card"
import { QuickActions } from "@/components/dashbord/quick-actions"
import { DataDisplay } from "@/components/dashbord/data-display"
import InteractiveDatePicker from "@/components/dashbord/date-selector"
import { ClipboardList, FilePlus, Package, ShoppingBag, TestTube, Users } from "lucide-react"
import RecentTransactions from "@/components/dashbord/transaction-card"
import SubscriptionStatus from "@/components/dashbord/subscription-status"
import WhatsappOrders from "@/components/dashbord/chronic-patients"
import { DashboardGuide } from "@/components/dashbord/dashboard-guide"
import { useOrderStats } from "@/hooks/use-order-stats"
import { useOrdersStore } from "@/store/orders-store"
import { useAuthStore } from "@/store/auth-store"
import { usePatientStore } from "@/store/patient-store"
import { useEffect } from "react"
import Link from "next/link"

export default function MedicalDashboard() {
  const { fetchOrders } = useOrdersStore()
  const { getProfile, user, isAuthenticated, isLoading: authLoading, hasInitialized } = useAuthStore()
  const { fetchPatients, patients } = usePatientStore()
  const orderStats = useOrderStats()

  useEffect(() => {
    // Only fetch data once auth is initialized and user is authenticated
    if (!hasInitialized) return
    
    if (isAuthenticated && user) {
      fetchOrders()
      fetchPatients()
    }
  }, [fetchOrders, fetchPatients, isAuthenticated, user, hasInitialized])

  return (
    <div className="w-full min-h-screen">
      <div className="w-full min-h-screen py-4 sm:py-6 lg:py-4">
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white border-2 border-green-100 rounded-lg p-2 sm:p-3 dark:border-0 dark:bg-transparent dark:text-white">
            <div className="mb-1 lg:mb-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Pharmacy Dashboard</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">Manage your practice with ease and efficiency</p>
            </div>
            <InteractiveDatePicker />
          </div>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Patients"
            value={patients.length.toString()}
            description="Active registered patients"
            icon={<Users className="w-7 h-7" />}
            color="bg-green-500"
          />
          <StatCard
            title="Total Orders"
            value={orderStats.totalOrders.toString()}
            description="All orders placed"
            icon={<ClipboardList className="w-7 h-7" />}
            color="bg-green-600"
          />
          <StatCard
            title="Monthly Revenue"
            value={`GHS ${orderStats.totalRevenue.toFixed(2)}`}
            description="Total earnings from delivered orders"
            icon={<ShoppingBag className="w-7 h-7" />}
            color="bg-green-700"
          />
          <StatCard
            title="Pending Orders"
            value={orderStats.pendingOrders.toString()}
            description="Orders awaiting processing"
            icon={<Package className="w-7 h-7" />}
            color="bg-green-800"
          />
        </section>

        {/* Quick Actions Section */}
        <div className="bg-white border-2 border-green-100 rounded-xl p-3 sm:p-4 dark:border-0 dark:bg-transparent dark:text-white">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <QuickActions
              text="Create Prescription"
              icon={<FilePlus className="w-6 h-6" />}
              color="bg-green-100 hover:bg-green-200 text-green-800"
              description="Write new prescriptions"
            />
            <QuickActions
              text="Rapid Testing"
              icon={<TestTube className="w-6 h-6" />}
              color="bg-green-200 hover:bg-green-300 text-green-900"
              description="Conduct medical tests"
            />
            <QuickActions
              text="Register Patient"
              icon={<Users className="w-6 h-6" />}
              color="bg-green-300 hover:bg-green-400 text-green-900"
              description="Add new patient records"
            />
          </div>
        </div>

        {/* Data Display Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Combined Transactions & Statistics Card */}
          <div className="bg-white border-2 border-green-100 rounded-xl p-4 dark:bg-transparent dark:border-gray-800">
            <div className="grid grid-cols-1 gap-4">
              <RecentTransactions />
              <DataDisplay />
            </div>
          </div>
          <div className="space-y-4">
            <WhatsappOrders />
            <SubscriptionStatus />
          </div>
        </section>
        </div>
      </div>

      {/* Dashboard Guide */}
      <DashboardGuide />
    </div>
  )
}
