"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  MessageCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Phone,
  User,
  Package,
  Clock,
  ChevronDown,
  Eye,
  X,
  MapPin,
  CreditCard,
  Download,
  FileSpreadsheet,
  RefreshCw,
  AlertCircle,
  Truck,
  Loader2
} from "lucide-react"

// Types for WhatsApp orders
interface WhatsAppOrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface WhatsAppOrder {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  items: WhatsAppOrderItem[]
  total: number
  status: "PENDING" | "PROCESSING" | "CONFIRMED" | "DELIVERED" | "CANCELLED"
  createdAt: string
  completedAt?: string
  cancelledAt?: string
  cancelReason?: string
  deliveryAddress?: string
  notes?: string
}

type TabType = "all" | "PENDING" | "PROCESSING" | "CONFIRMED" | "DELIVERED" | "CANCELLED"

const STORAGE_KEY = "whatsapp-orders-cache"

// Helper functions for localStorage persistence
const loadOrdersFromStorage = (): WhatsAppOrder[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error("Error loading orders from storage:", e)
  }
  return []
}

const saveOrdersToStorage = (orders: WhatsAppOrder[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch (e) {
    console.error("Error saving orders to storage:", e)
  }
}

// Helper function to generate orderNumber from id
const generateOrderNumber = (id: string | undefined | null): string => {
  if (!id) return `ORD-${Date.now().toString().slice(-8)}`
  const idStr = String(id)
  return `ORD-${idStr.length >= 8 ? idStr.slice(-8).toUpperCase() : idStr.padStart(8, '0').toUpperCase()}`
}

export default function WhatsAppOrdersPage() {
  const [orders, setOrders] = useState<WhatsAppOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<WhatsAppOrder | null>(null)

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      saveOrdersToStorage(orders)
    }
  }, [orders])

  const fetchWhatsAppOrders = async () => {
    setIsLoading(true)
    setError(null)
    
    // Load stored orders first (including non-PENDING orders)
    const storedOrders = loadOrdersFromStorage()
    
    try {
      const response = await axios.get("/api/whatsapp-orders", { withCredentials: true })
      const data = response.data
      
      console.log("[WhatsApp Orders Page] Raw response:", data)
      
      // Handle the response structure: { status, statusCode, data: { orders: [], count: 0 } }
      const ordersData = data?.data?.orders || data?.orders || data?.whatsappOrders || data?.data || []
      console.log("[WhatsApp Orders Page] Orders data:", ordersData)
      
      const ordersList = Array.isArray(ordersData) ? ordersData : []
      console.log("[WhatsApp Orders Page] Orders list length:", ordersList.length)
      
      // Transform API data to match our interface
      const transformedOrders: WhatsAppOrder[] = ordersList.map((order: any) => {
        console.log("[WhatsApp Orders Page] Single order raw data:", JSON.stringify(order, null, 2))
        
        // Customer data might be in different places
        const personalData = order.personalData || order.personal_data || order.customer || order.customerData || order.customer_data || {}
        const userData = order.user || order.userData || order.user_data || {}
        
        // Try multiple sources for customer name - check direct "name" field first
        let customerName = order.name || order.customerName || order.customer_name || order.fullName || order.full_name || order.buyerName || order.buyer_name
        
        // If not found directly, check nested objects
        if (!customerName) {
          if (personalData.firstName && personalData.lastName) {
            customerName = `${personalData.firstName} ${personalData.lastName}`
          } else if (personalData.firstName || personalData.lastName) {
            customerName = personalData.firstName || personalData.lastName
          } else if (personalData.name || personalData.fullName || personalData.full_name) {
            customerName = personalData.name || personalData.fullName || personalData.full_name
          } else if (userData.firstName && userData.lastName) {
            customerName = `${userData.firstName} ${userData.lastName}`
          } else if (userData.firstName || userData.lastName) {
            customerName = userData.firstName || userData.lastName
          } else if (userData.name || userData.fullName) {
            customerName = userData.name || userData.fullName
          }
        }
        
        // Fallback
        if (!customerName) {
          customerName = "Unknown Customer"
        }
        
        // Check for phone
        const customerPhone = personalData.contactNumber || personalData.contact_number || personalData.phone || personalData.phoneNumber || personalData.phone_number 
          || userData.contactNumber || userData.phone || userData.phoneNumber
          || order.customerPhone || order.customer_phone || order.phone || order.phoneNumber || order.phone_number || order.contactNumber || ""
        
        console.log("[WhatsApp Orders Page] Extracted customerName:", customerName, "customerPhone:", customerPhone)
        console.log("[WhatsApp Orders Page] Order fields - orderNumber:", order.orderNumber, "order_number:", order.order_number, "orderId:", order.orderId, "uuid:", order.uuid)
        
        // Items are in orders array
        const itemsArray = order.orders || order.items || order.products || order.orderItems || []
        
        const orderId = order.orderId || order.id || order.uuid || order._id || `WA-${Date.now()}`
        const orderNumber = order.orderNumber || order.order_number || generateOrderNumber(orderId)
        
        console.log("[WhatsApp Orders Page] Generated orderId:", orderId, "orderNumber:", orderNumber)
        
        return {
          id: orderId,
          orderNumber,
          customerName,
          customerPhone,
          items: itemsArray.map((item: any, idx: number) => ({
            id: item.id || item.uuid || item.productId || item.product_id || `item-${idx}`,
            name: item.name || item.productName || item.product_name || item.drug_name || item.drugName || item.product?.name || "Unknown Item",
            quantity: item.quantity || item.qty || 1,
            price: item.price || item.unitPrice || item.unit_price || item.selling_price || item.sellingPrice || 0,
          })),
          total: order.totalCost || order.amountPayable || order.total || order.amount || 0,
          status: order.status || "PENDING",
          createdAt: order.dateOrdered || order.createdAt || order.created_at || new Date().toISOString(),
          completedAt: order.completedAt || order.completed_at,
          cancelledAt: order.cancelledAt || order.cancelled_at || order.deletedAt,
          cancelReason: order.cancelReason || order.cancel_reason,
          deliveryAddress: order.deliveryAddress || order.delivery_address || personalData.Location || personalData.location || personalData.address,
          notes: order.notes || order.note || order.message,
        }
      })
      
      // Merge with stored orders: 
      // - Keep non-PENDING orders from storage (they won't be in /incoming response)
      // - Update PENDING orders from server (fresh data)
      // - Add any new orders from server
      const nonPendingStoredOrders = storedOrders
        .filter(stored => stored.status !== "PENDING")
        .map(stored => ({
          ...stored,
          // Ensure orderNumber exists for older stored orders
          orderNumber: stored.orderNumber || generateOrderNumber(stored.id)
        }))
      
      // Create a map of server order IDs for quick lookup
      const serverOrderIds = new Set(transformedOrders.map(o => o.id))
      
      // Filter out non-pending stored orders that might have been updated on server
      // (keep only those not in server response)
      const uniqueNonPendingOrders = nonPendingStoredOrders.filter(
        stored => !serverOrderIds.has(stored.id)
      )
      
      // Combine: server orders (fresh PENDING) + stored non-pending orders
      const mergedOrders = [...transformedOrders, ...uniqueNonPendingOrders]
      
      // Sort by date (newest first)
      mergedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      console.log("[WhatsApp Orders Page] Merged orders count:", mergedOrders.length)
      setOrders(mergedOrders)
    } catch (err: any) {
      console.error("Error fetching WhatsApp orders:", err)
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch orders"
      
      // If fetch fails, use stored orders as fallback (with orderNumber migration)
      if (storedOrders.length > 0) {
        console.log("[WhatsApp Orders Page] Using stored orders as fallback")
        const migratedOrders = storedOrders.map(stored => ({
          ...stored,
          orderNumber: stored.orderNumber || generateOrderNumber(stored.id)
        }))
        setOrders(migratedOrders)
      }
      
      // Check if token expired and redirect to login
      if (err.response?.status === 401 || errorMessage.toLowerCase().includes("token expired") || errorMessage.toLowerCase().includes("authentication required")) {
        window.location.href = "/login"
        return
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null)
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null)
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)

  const processOrder = async (orderId: string) => {
    setProcessingOrderId(orderId)
    try {
      const response = await axios.patch("/api/whatsapp-orders/process", { orderId }, { withCredentials: true })
      console.log("[WhatsApp Orders] Process response:", response.data)
      
      if (response.data?.status === "success" || response.status === 200) {
        // Update the local state to reflect the processed order
        // Don't refetch since /incoming only returns PENDING orders
        // The processed order would disappear from the server response
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: "PROCESSING" as const }
              : order
          )
        )
        // Note: Not calling fetchWhatsAppOrders() here because 
        // the /incoming endpoint only returns PENDING orders
        // and would overwrite our local PROCESSING status update
      }
    } catch (err: any) {
      console.error("Error processing order:", err)
      console.error("Error response data:", err.response?.data)
      alert(err.response?.data?.message || err.message || "Failed to process order")
    } finally {
      setProcessingOrderId(null)
    }
  }

  const confirmOrder = async (orderId: string) => {
    setConfirmingOrderId(orderId)
    try {
      const response = await axios.patch("/api/whatsapp-orders/process", { orderId, status: "CONFIRMED" }, { withCredentials: true })
      console.log("[WhatsApp Orders] Confirm response:", response.data)
      
      if (response.data?.status === "success" || response.status === 200) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: "CONFIRMED" as const }
              : order
          )
        )
      }
    } catch (err: any) {
      console.error("Error confirming order:", err)
      alert(err.response?.data?.message || err.message || "Failed to confirm order")
    } finally {
      setConfirmingOrderId(null)
    }
  }

  const [deliveringOrderId, setDeliveringOrderId] = useState<string | null>(null)

  const deliverOrder = async (orderId: string) => {
    setDeliveringOrderId(orderId)
    try {
      const response = await axios.patch("/api/whatsapp-orders/process", { orderId, status: "DELIVERED" }, { withCredentials: true })
      console.log("[WhatsApp Orders] Deliver response:", response.data)
      
      if (response.data?.status === "success" || response.status === 200) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: "DELIVERED" as const, completedAt: new Date().toISOString() }
              : order
          )
        )
      }
    } catch (err: any) {
      console.error("Error marking order as delivered:", err)
      alert(err.response?.data?.message || err.message || "Failed to mark order as delivered")
    } finally {
      setDeliveringOrderId(null)
    }
  }

  const cancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return
    
    setCancellingOrderId(orderId)
    try {
      const response = await axios.patch("/api/whatsapp-orders/process", { orderId, status: "CANCELLED" }, { withCredentials: true })
      console.log("[WhatsApp Orders] Cancel response:", response.data)
      
      if (response.data?.status === "success" || response.status === 200) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: "CANCELLED" as const, cancelledAt: new Date().toISOString() }
              : order
          )
        )
      }
    } catch (err: any) {
      console.error("Error cancelling order:", err)
      alert(err.response?.data?.message || err.message || "Failed to cancel order")
    } finally {
      setCancellingOrderId(null)
    }
  }

  useEffect(() => {
    fetchWhatsAppOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const getTabCount = (tab: TabType) => {
    if (tab === "all") return orders.length
    return orders.filter((order) => order.status === tab).length
  }

  const getTotalRevenue = () => {
    return orders
      .filter((order) => order.status === "DELIVERED")
      .reduce((sum, order) => sum + order.total, 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportToCSV = (exportType: "all" | "DELIVERED" | "CANCELLED") => {
    let dataToExport = orders
    if (exportType !== "all") {
      dataToExport = orders.filter((order) => order.status === exportType)
    }

    if (dataToExport.length === 0) {
      alert("No orders to export")
      return
    }

    // CSV headers
    const headers = [
      "Order ID",
      "Customer Name",
      "Customer Phone",
      "Items",
      "Total (GH₵)",
      "Status",
      "Order Date",
      "Completed/Cancelled Date",
      "Delivery Address",
      "Notes",
      "Cancel Reason"
    ]

    // CSV rows
    const rows = dataToExport.map((order) => [
      order.id,
      order.customerName,
      order.customerPhone,
      order.items.map((item) => `${item.name} (x${item.quantity})`).join("; "),
      order.total.toFixed(2),
      order.status,
      new Date(order.createdAt).toLocaleString("en-GB"),
      order.completedAt 
        ? new Date(order.completedAt).toLocaleString("en-GB") 
        : order.cancelledAt 
          ? new Date(order.cancelledAt).toLocaleString("en-GB") 
          : "",
      order.deliveryAddress || "",
      order.notes || "",
      order.cancelReason || ""
    ])

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => 
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `whatsapp-orders-${exportType}-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const tabs = [
    { key: "all" as TabType, label: "All Orders", icon: Package },
    { key: "PENDING" as TabType, label: "Pending", icon: Clock },
    { key: "PROCESSING" as TabType, label: "Processing", icon: Loader2 },
    { key: "CONFIRMED" as TabType, label: "Confirmed", icon: CheckCircle2 },
    { key: "DELIVERED" as TabType, label: "Delivered", icon: Truck },
    { key: "CANCELLED" as TabType, label: "Cancelled", icon: XCircle },
  ]

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
            <MessageCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-gray-600">Loading WhatsApp orders...</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load WhatsApp orders</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button 
            onClick={() => fetchWhatsAppOrders()} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6"
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">WhatsApp Orders</h1>
            <p className="text-sm text-gray-500">Manage orders received via WhatsApp</p>
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
              <h3 className="font-semibold text-gray-900">Export Transactions</h3>
              <p className="text-sm text-gray-500">Download order data as CSV file</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 flex items-center gap-2"
              onClick={() => exportToCSV("all")}
            >
              <Download className="w-4 h-4" />
              All Orders ({orders.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 flex items-center gap-2"
              onClick={() => exportToCSV("DELIVERED")}
            >
              <Download className="w-4 h-4" />
              Delivered ({getTabCount("DELIVERED")})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center gap-2"
              onClick={() => exportToCSV("CANCELLED")}
            >
              <Download className="w-4 h-4" />
              Cancelled ({getTabCount("CANCELLED")})
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              className={`rounded-sm flex items-center gap-2 ${
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

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, phone, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full md:w-80 rounded-sm border-gray-200"
          />
        </div>
      </div>

      {/* Orders List Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Card Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Orders</span>
            <span className="text-xs text-gray-400">({filteredOrders.length} results)</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-gray-500 hover:text-emerald-600"
            onClick={() => fetchWhatsAppOrders()}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Refresh
          </Button>
        </div>
        
        {/* Scrollable Orders Container */}
        <div className="h-[calc(100vh-420px)] min-h-[300px] max-h-[600px] overflow-y-auto p-3 space-y-2">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-white transition-all px-4 py-2.5"
              >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                {/* Order Info */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    order.status === "DELIVERED" 
                      ? "bg-emerald-100" 
                      : order.status === "CONFIRMED"
                      ? "bg-blue-100"
                      : order.status === "PROCESSING"
                      ? "bg-amber-100"
                      : order.status === "PENDING"
                      ? "bg-gray-100"
                      : "bg-red-100"
                  }`}>
                    {order.status === "DELIVERED" ? (
                      <Truck className="w-5 h-5 text-emerald-600" />
                    ) : order.status === "CONFIRMED" ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    ) : order.status === "PROCESSING" ? (
                      <Loader2 className="w-5 h-5 text-amber-600" />
                    ) : order.status === "PENDING" ? (
                      <Clock className="w-5 h-5 text-gray-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        order.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "PROCESSING"
                          ? "bg-amber-100 text-amber-700"
                          : order.status === "PENDING"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {order.customerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.customerPhone}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
                    <p className="text-base font-bold text-gray-900">GH₵ {order.total.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.status === "PENDING" && (
                      <Button
                        size="sm"
                        className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs px-3"
                        onClick={() => processOrder(order.id)}
                        disabled={processingOrderId === order.id}
                      >
                        {processingOrderId === order.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Process
                          </>
                        )}
                      </Button>
                    )}
                    {order.status === "PROCESSING" && (
                      <>
                        <Button
                          size="sm"
                          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs px-3"
                          onClick={() => confirmOrder(order.id)}
                          disabled={confirmingOrderId === order.id}
                        >
                          {confirmingOrderId === order.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />
                              Confirming...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Confirm
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-8 text-xs px-3"
                          onClick={() => cancelOrder(order.id)}
                          disabled={cancellingOrderId === order.id}
                        >
                          {cancellingOrderId === order.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Cancel
                            </>
                          )}
                        </Button>
                      </>
                    )}
                    {order.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs px-3"
                        onClick={() => deliverOrder(order.id)}
                        disabled={deliveringOrderId === order.id}
                      >
                        {deliveringOrderId === order.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />
                            Delivering...
                          </>
                        ) : (
                          <>
                            <Truck className="w-3.5 h-3.5 mr-1" />
                            Mark Delivered
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 h-8 text-xs px-3"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Package className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-1">No orders found</p>
            <p className="text-gray-400 text-xs">
              {searchQuery 
                ? "Try adjusting your search query" 
                : "WhatsApp orders will appear here"}
            </p>
          </div>
        )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedOrder.status === "DELIVERED" 
                    ? "bg-emerald-100" 
                    : selectedOrder.status === "CONFIRMED"
                    ? "bg-blue-100"
                    : selectedOrder.status === "PROCESSING"
                    ? "bg-amber-100"
                    : selectedOrder.status === "PENDING"
                    ? "bg-gray-100"
                    : "bg-red-100"
                }`}>
                  <MessageCircle className={`w-5 h-5 ${
                    selectedOrder.status === "DELIVERED" 
                      ? "text-emerald-600" 
                      : selectedOrder.status === "CONFIRMED"
                      ? "text-blue-600"
                      : selectedOrder.status === "PROCESSING"
                      ? "text-amber-600"
                      : selectedOrder.status === "PENDING"
                      ? "text-gray-600"
                      : "text-red-600"
                  }`} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedOrder.id}</h2>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    selectedOrder.status === "DELIVERED"
                      ? "bg-emerald-100 text-emerald-700"
                      : selectedOrder.status === "CONFIRMED"
                      ? "bg-blue-100 text-blue-700"
                      : selectedOrder.status === "PROCESSING"
                      ? "bg-amber-100 text-amber-700"
                      : selectedOrder.status === "PENDING"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{selectedOrder.customerPhone}</span>
                  </div>
                  {selectedOrder.deliveryAddress && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedOrder.deliveryAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Order Items</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {selectedOrder.items.map((item, index) => (
                    <div 
                      key={item.id}
                      className={`flex items-center justify-between p-3 ${
                        index !== selectedOrder.items.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        GH₵ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="text-lg font-bold text-emerald-600">
                      GH₵ {selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Created</p>
                      <p className="text-xs text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>
                  {selectedOrder.status === "DELIVERED" && selectedOrder.completedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order Delivered</p>
                        <p className="text-xs text-gray-500">{formatDate(selectedOrder.completedAt)}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === "CANCELLED" && selectedOrder.cancelledAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order Cancelled</p>
                        <p className="text-xs text-gray-500">{formatDate(selectedOrder.cancelledAt)}</p>
                        {selectedOrder.cancelReason && (
                          <p className="text-xs text-red-600 mt-1">Reason: {selectedOrder.cancelReason}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-yellow-800 mb-1">Customer Notes</h3>
                  <p className="text-sm text-yellow-700">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
              {selectedOrder.status === "PENDING" && (
                <Button
                  onClick={() => {
                    processOrder(selectedOrder.id)
                    setSelectedOrder(null)
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                  disabled={processingOrderId === selectedOrder.id}
                >
                  {processingOrderId === selectedOrder.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Process Order
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={() => setSelectedOrder(null)}
                variant={selectedOrder.status === "PENDING" ? "outline" : "default"}
                className={selectedOrder.status === "PENDING" 
                  ? "flex-1 rounded-xl" 
                  : "w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                }
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
