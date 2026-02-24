"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  CreditCard,
  Eye,
  RefreshCw,
  ShoppingBag,
  AlertCircle,
  Download,
  FileSpreadsheet,
  ChevronRight
} from "lucide-react"
import { useOrdersStore, type Order } from "@/store/orders-store"
import OrderDetails from "./order-details"

type TabType = "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export default function OrdersHistory() {
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { orders, isLoading, error, fetchOrders } = useOrdersStore()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleBack = () => {
    setSelectedOrder(null)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab
    const matchesSearch = 
      (order.orderNumber?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (order.id?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      order.items.some(item => 
        (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      )
    return matchesTab && matchesSearch
  })

  const getTabCount = (tab: TabType) => {
    if (tab === "all") return orders.length
    return orders.filter((order) => order.status === tab).length
  }

  const getTotalSpent = () => {
    return orders
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + (order.totalCost || 0), 0)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          icon: Clock,
          label: "Pending"
        }
      case "processing":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: RefreshCw,
          label: "Processing"
        }
      case "shipped":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          icon: Truck,
          label: "Shipped"
        }
      case "delivered":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          icon: CheckCircle2,
          label: "Delivered"
        }
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: XCircle,
          label: "Cancelled"
        }
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: Package,
          label: "Unknown"
        }
    }
  }

  const tabs = [
    { key: "all" as TabType, label: "All", icon: Package },
    { key: "pending" as TabType, label: "Pending", icon: Clock },
    { key: "processing" as TabType, label: "Processing", icon: RefreshCw },
    { key: "shipped" as TabType, label: "Shipped", icon: Truck },
    { key: "delivered" as TabType, label: "Delivered", icon: CheckCircle2 },
    { key: "cancelled" as TabType, label: "Cancelled", icon: XCircle },
  ]

  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      alert("No orders to export")
      return
    }

    const headers = [
      "Order ID",
      "Order Number",
      "Items",
      "Total (GH₵)",
      "Status",
      "Payment Method",
      "Order Date",
    ]

    const rows = filteredOrders.map((order) => [
      order.id,
      order.orderNumber || "",
      order.items.map((item) => `${item.name || "Item"} (x${item.quantity})`).join("; "),
      (order.totalCost || 0).toFixed(2),
      order.status || "",
      order.paymentMethod || "",
      order.createdAt ? new Date(order.createdAt).toLocaleString("en-GB") : "",
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => 
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `orders-${activeTab}-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (selectedOrder) {
    return <OrderDetails order={selectedOrder} onBack={handleBack} />
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load orders</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button 
            onClick={() => fetchOrders()} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-[10px] px-6"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders & Purchase History</h1>
            <p className="text-sm text-gray-500">Track and manage all your orders</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{getTabCount("pending")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold text-emerald-600">{getTabCount("delivered")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">GH₵ {getTotalSpent().toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Export Orders</h3>
              <p className="text-sm text-gray-500">Download your order history as CSV</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-[10px] border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 flex items-center gap-2"
            onClick={exportToCSV}
          >
            <Download className="w-4 h-4" />
            Export {activeTab === "all" ? "All" : tabs.find(t => t.key === activeTab)?.label} ({filteredOrders.length})
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              size="sm"
              className={`rounded-[10px] flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "text-gray-600 hover:text-gray-900 border-gray-200"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label} ({getTabCount(tab.key)})
            </Button>
          ))}
        </div>

        <div className="relative w-full lg:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by order ID or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full lg:w-80 rounded-[10px] border-gray-200"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-2">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status)
            const StatusIcon = statusConfig.icon
            const firstItem = order.items[0]
            const itemCount = order.items.length
            const totalQuantity = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-emerald-200 transition-all duration-200 overflow-hidden cursor-pointer"
                onClick={() => handleViewDetails(order)}
              >
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    {/* Status Icon */}
                    <div className={`w-9 h-9 rounded-lg ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
                    </div>
                    
                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900 truncate">
                          {order.orderNumber || order.id?.slice(0, 8)}
                        </span>
                        <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{totalQuantity} item{totalQuantity !== 1 ? "s" : ""}</span>
                        <span>•</span>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm text-gray-900">GH₵ {(order.totalCost || 0).toFixed(2)}</p>
                    </div>
                    
                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-900 text-lg font-medium mb-2">No orders found</p>
            <p className="text-gray-500 text-sm mb-6">
              {searchQuery 
                ? "Try adjusting your search query" 
                : activeTab !== "all"
                ? `You don't have any ${activeTab} orders`
                : "Your orders will appear here once you make a purchase"}
            </p>
            {activeTab !== "all" && (
              <Button
                variant="outline"
                className="rounded-[10px] border-gray-200"
                onClick={() => setActiveTab("all")}
              >
                View All Orders
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
