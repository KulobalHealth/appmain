import axios from "axios"
import { create } from "zustand"
import { useAuthStore } from "./auth-store"

export type OrderItem = {
  productId: string
  quantity: number
  [key: string]: any
}

export type Order = {
  id: string
  orderNumber?: string
  status?: string
  totalCost?: number
  deliveryMethod?: string
  paymentType?: string
  paymentMethod?: string
  numberOfItems?: number
  pharmacyId?: string
  items: OrderItem[]
  raw?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export type CreateOrderPayload = {
  pharmacyId?: string
  totalCost: number
  deliveryMethod: string
  paymentType: string
  numberOfItems: number
  itemList: Array<{
    productId: string
    quantity: number
  }>
  paymentReference?: string
  discount?: number
  amountPayable: number
  paymentMethod: string
  deliveryId: string
}

type FetchOrdersOptions = {
  pharmacyId?: string
  includeCurrent?: boolean
  includeHistory?: boolean
  status?: string
}

type OrdersStore = {
  orders: Order[]
  selectedOrder: Order | null
  isLoading: boolean
  error: string | null
  
  fetchOrders: (options?: FetchOrdersOptions) => Promise<void>
  fetchOrderById: (orderId: string) => Promise<Order | null>
  createOrder: (orderData: CreateOrderPayload) => Promise<Order>
  cancelOrder: (orderId: string, reason?: string) => Promise<void>
  selectOrder: (order: Order | null) => void
  clearError: () => void
}

export const useOrdersStore = create<OrdersStore>()((set, get) => ({
    orders: [],
    selectedOrder: null,
    isLoading: false,
    error: null,

  fetchOrders: async (options) => {
        set({ isLoading: true, error: null })

    try {
      const base = process.env.NEXT_PUBLIC_MARKET_URL
      if (!base) throw new Error("NEXT_PUBLIC_MARKET_URL is not configured")

      const { user, isAuthenticated } = useAuthStore.getState()
      
      // If user is not authenticated, don't try to fetch orders
      if (!isAuthenticated || !user) {
        set({ isLoading: false, error: null })
        return
      }
      
      const pharmacyId =
        options?.pharmacyId ||
        user?.pharmacyId ||
        (typeof user?.pharmacy === "string" ? user?.pharmacy : user?.pharmacy?.pharmacyId)

      if (!pharmacyId) {
        // User is logged in but missing pharmacyId - log warning but don't throw
        console.warn("Unable to determine pharmacy ID for fetching orders")
        set({ isLoading: false, error: null })
        return
      }

      const includeCurrent = options?.includeCurrent ?? true
      const includeHistory = options?.includeHistory ?? true

      if (!includeCurrent && !includeHistory) {
        set({ error: "At least one of includeCurrent or includeHistory must be true", isLoading: false })
        return
      }

      // Use local API proxy routes to properly forward auth cookies
      const urls: string[] = []
      if (includeCurrent) urls.push(`/api/orders/current/${pharmacyId}`)
      if (includeHistory) urls.push(`/api/orders/history/${pharmacyId}`)

      // Use Promise.allSettled to handle partial failures gracefully
      const results = await Promise.allSettled(urls.map((url) => axios.get(url, { withCredentials: true })))

      const orders: Order[] = []
      const errors: string[] = []

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const errorMsg = result.reason?.response?.data?.message || result.reason?.message || "Request failed"
          console.warn(`Failed to fetch from ${urls[index]}:`, errorMsg)
          errors.push(errorMsg)
          return
        }

        const response = result.value
        // Handle the API response structure: { status, statusCode, data: [...] }
        const candidates = [
          response.data?.data, // Primary structure: data array
          response.data?.data?.orders,
          response.data?.data?.orderHistory,
          response.data?.data?.currentOrders,
          response.data?.orders,
        ]

        const list = candidates.find(Array.isArray) as any[] | undefined
        const actualList = Array.isArray(list) ? list : []

        actualList.forEach((raw, index) => {
          // Handle products array (API uses 'products', not 'itemList' or 'items')
          const itemsSource =
            raw?.products ||
            raw?.itemList ||
            raw?.items ||
            raw?.orderItems ||
            raw?.cartItems ||
            []

          // Transform products to OrderItem format
          // Note: API products don't have quantity, so we default to 1 or calculate from numberOfItems
          const items = Array.isArray(itemsSource)
            ? itemsSource.map((item: any, idx: number) => {
                // If quantity exists, use it; otherwise default to 1
                // If numberOfItems matches product count, assume 1 each
                const quantity = Number.isFinite(Number(item?.quantity))
                  ? Number(item.quantity)
                  : raw?.numberOfItems && itemsSource.length > 0
                  ? Math.floor((raw.numberOfItems || 0) / itemsSource.length)
                  : 1

                return {
                  productId: item?.productId || item?.id || `product-${index}-${idx}`,
                  quantity,
                  name: item?.productName || item?.name,
                  price: item?.price,
                  ...item,
                }
              })
            : []

          // Use orderId as primary identifier (API uses 'orderId', not '_id' or 'id')
          const id = raw?.orderId || raw?._id || raw?.id || raw?.reference || `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

          // Map status from uppercase API format to lowercase frontend format
          const statusValue = String(raw?.status || raw?.orderStatus || "").toUpperCase()
          let mappedStatus = "pending"
          if (statusValue === "PENDING") mappedStatus = "pending"
          else if (statusValue === "PROCESSING") mappedStatus = "processing"
          else if (statusValue === "SHIPPED" || statusValue.includes("SHIP") || statusValue.includes("TRANSIT")) mappedStatus = "shipped"
          else if (statusValue === "DELIVERED" || statusValue.includes("DELIVER") || statusValue.includes("COMPLETE")) mappedStatus = "delivered"
          else if (statusValue === "CANCELLED" || statusValue.includes("CANCEL") || statusValue.includes("REJECT") || statusValue.includes("DECLINE")) mappedStatus = "cancelled"
          else mappedStatus = statusValue.toLowerCase()

          // Map paymentType from API format to frontend format
          const paymentTypeValue = String(raw?.paymentType || "").toUpperCase()
          let mappedPaymentType = "full-payment"
          if (paymentTypeValue === "FULL_PAYMENT") mappedPaymentType = "full-payment"
          else if (paymentTypeValue === "PARTIAL_PAYMENT" || paymentTypeValue.includes("INSTALL")) mappedPaymentType = "installment-payment"
          else if (paymentTypeValue.includes("CREDIT")) mappedPaymentType = "credit"
          else mappedPaymentType = paymentTypeValue.toLowerCase().replace(/_/g, "-")

          // Map paymentMethod from API format to frontend format
          const paymentMethodValue = String(raw?.paymentMethod || "").toUpperCase()
          let mappedPaymentMethod = "cash-on-delivery"
          if (paymentMethodValue === "PAYMENT_ON_ONLINE" || paymentMethodValue.includes("ONLINE")) mappedPaymentMethod = "online-payment"
          else if (paymentMethodValue === "PAYMENT_ON_DELIVERY" || paymentMethodValue.includes("DELIVERY")) mappedPaymentMethod = "cash-on-delivery"
          else mappedPaymentMethod = paymentMethodValue.toLowerCase().replace(/_/g, "-")

          orders.push({
            id,
            orderNumber: raw?.orderNumber || raw?.orderNo || raw?.reference || raw?.orderId || id,
            pharmacyId: raw?.pharmacyId || raw?.organizationId,
            totalCost: Number.isFinite(Number(raw?.totalCost ?? raw?.totalAmount ?? raw?.total))
              ? Number(raw?.totalCost ?? raw?.totalAmount ?? raw?.total)
              : undefined,
            deliveryMethod: raw?.deliveryMethod,
            paymentType: mappedPaymentType,
            paymentMethod: mappedPaymentMethod,
            numberOfItems: raw?.numberOfItems ?? (items.length > 0 ? items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) : undefined),
            status: mappedStatus,
            items,
            raw,
            createdAt: raw?.dateOrdered || raw?.createdAt || raw?.dateCreated,
            updatedAt: raw?.updatedAt || raw?.lastUpdated,
          })
        })
      })

      const deduped = Array.from(
        orders.reduce((map, order) => map.set(order.id, order), new Map<string, Order>()).values(),
      )

      const filtered = options?.status
        ? deduped.filter((order) => {
            const value = String(order.status || "").toLowerCase()
            const target = String(options.status || "").toLowerCase()
            return value === target
          })
        : deduped

      filtered.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bDate - aDate
      })

      // If all requests failed, show error; otherwise show orders (even if partial)
      if (errors.length === urls.length && filtered.length === 0) {
        // Check for specific error types
        const is404 = errors.some(e => e.includes("404") || e.includes("not found"))
        const is401 = errors.some(e => e.includes("401") || e.includes("Authentication") || e.includes("Unauthorized"))
        
        if (is401) {
          set({ error: "Please log in to view your orders", orders: [], isLoading: false })
        } else if (is404) {
          // 404 likely means no orders exist yet - treat as empty, not error
          set({ orders: [], isLoading: false, error: null })
        } else {
          set({ error: errors[0] || "Failed to fetch orders", orders: [], isLoading: false })
        }
      } else {
        set({ orders: filtered, isLoading: false, error: null })
      }
        } catch (error: any) {
      console.error("Error fetching orders:", error)
      const message = error.response?.data?.message || error.message || "Failed to fetch orders"
      set({ error: message, isLoading: false })
    }
  },

  fetchOrderById: async (orderId: string) => {
        set({ isLoading: true, error: null })
        try {
      const base = process.env.NEXT_PUBLIC_MARKET_URL
      if (!base) throw new Error("NEXT_PUBLIC_MARKET_URL is not configured")

      const response = await axios.get(`${base.replace(/\/$/, "")}/order/${orderId}`, { withCredentials: true })
      const raw =
        response.data?.data?.order ||
        response.data?.data ||
        response.data?.order ||
        (Array.isArray(response.data) ? response.data[0] : null)

      if (!raw) throw new Error("Order not found")

      // Handle products array (API uses 'products', not 'itemList' or 'items')
      const itemsSource =
        raw?.products ||
        raw?.itemList ||
        raw?.items ||
        raw?.orderItems ||
        raw?.cartItems ||
        []

      // Transform products to OrderItem format
      const items = Array.isArray(itemsSource)
        ? itemsSource.map((item: any, idx: number) => {
            const quantity = Number.isFinite(Number(item?.quantity))
              ? Number(item.quantity)
              : raw?.numberOfItems && itemsSource.length > 0
              ? Math.floor((raw.numberOfItems || 0) / itemsSource.length)
              : 1

            return {
              productId: item?.productId || item?.id || `product-${idx}`,
              quantity,
              name: item?.productName || item?.name,
              price: item?.price,
              ...item,
            }
          })
        : []

      // Use orderId as primary identifier
      const id = raw?.orderId || raw?._id || raw?.id || orderId

      // Map status from uppercase API format to lowercase frontend format
      const statusValue = String(raw?.status || raw?.orderStatus || "").toUpperCase()
      let mappedStatus = "pending"
      if (statusValue === "PENDING") mappedStatus = "pending"
      else if (statusValue === "PROCESSING") mappedStatus = "processing"
      else if (statusValue === "SHIPPED" || statusValue.includes("SHIP") || statusValue.includes("TRANSIT")) mappedStatus = "shipped"
      else if (statusValue === "DELIVERED" || statusValue.includes("DELIVER") || statusValue.includes("COMPLETE")) mappedStatus = "delivered"
      else if (statusValue === "CANCELLED" || statusValue.includes("CANCEL") || statusValue.includes("REJECT") || statusValue.includes("DECLINE")) mappedStatus = "cancelled"
      else mappedStatus = statusValue.toLowerCase()

      // Map paymentType from API format to frontend format
      const paymentTypeValue = String(raw?.paymentType || "").toUpperCase()
      let mappedPaymentType = "full-payment"
      if (paymentTypeValue === "FULL_PAYMENT") mappedPaymentType = "full-payment"
      else if (paymentTypeValue === "PARTIAL_PAYMENT" || paymentTypeValue.includes("INSTALL")) mappedPaymentType = "installment-payment"
      else if (paymentTypeValue.includes("CREDIT")) mappedPaymentType = "credit"
      else mappedPaymentType = paymentTypeValue.toLowerCase().replace(/_/g, "-")

      // Map paymentMethod from API format to frontend format
      const paymentMethodValue = String(raw?.paymentMethod || "").toUpperCase()
      let mappedPaymentMethod = "cash-on-delivery"
      if (paymentMethodValue === "PAYMENT_ON_ONLINE" || paymentMethodValue.includes("ONLINE")) mappedPaymentMethod = "online-payment"
      else if (paymentMethodValue === "PAYMENT_ON_DELIVERY" || paymentMethodValue.includes("DELIVERY")) mappedPaymentMethod = "cash-on-delivery"
      else mappedPaymentMethod = paymentMethodValue.toLowerCase().replace(/_/g, "-")

      const order: Order = {
        id,
        orderNumber: raw?.orderNumber || raw?.orderNo || raw?.reference || raw?.orderId || id,
        pharmacyId: raw?.pharmacyId || raw?.organizationId,
        totalCost: Number.isFinite(Number(raw?.totalCost ?? raw?.totalAmount ?? raw?.total))
          ? Number(raw?.totalCost ?? raw?.totalAmount ?? raw?.total)
          : undefined,
        deliveryMethod: raw?.deliveryMethod,
        paymentType: mappedPaymentType,
        paymentMethod: mappedPaymentMethod,
        numberOfItems: raw?.numberOfItems ?? (items.length > 0 ? items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) : undefined),
        status: mappedStatus,
        items,
        raw,
        createdAt: raw?.dateOrdered || raw?.createdAt || raw?.dateCreated,
        updatedAt: raw?.updatedAt || raw?.lastUpdated,
      }

            set({ selectedOrder: order, isLoading: false })
            return order
        } catch (error: any) {
      console.error("Error fetching order by id:", error)
      const message = error.response?.data?.message || error.message || "Failed to fetch order"
      set({ error: message, isLoading: false })
          return null
        }
      },

      createOrder: async (orderData) => {
        set({ isLoading: true, error: null })
        try {
      const base = process.env.NEXT_PUBLIC_MARKET_URL
      if (!base) throw new Error("NEXT_PUBLIC_MARKET_URL is not configured")

      const { user } = useAuthStore.getState()
      const pharmacyId =
        orderData.pharmacyId ||
        user?.pharmacyId ||
        (typeof user?.pharmacy === "string" ? user?.pharmacy : user?.pharmacy?.pharmacyId)

      if (!pharmacyId) throw new Error("Unable to determine pharmacy ID. Please sign in again.")

      // Map paymentMethod to backend enum values
      const paymentMethodMap: Record<string, string> = {
        online: "PAYMENT_ON_ONLINE",
        "cash-on-delivery": "PAYMENT_ON_DELIVERY",
        "PAYMENT_ON_ONLINE": "PAYMENT_ON_ONLINE",
        "PAYMENT_ON_DELIVERY": "PAYMENT_ON_DELIVERY",
      }
      const apiPaymentMethod = paymentMethodMap[orderData.paymentMethod] || "PAYMENT_ON_DELIVERY"

      // Map paymentType to backend enum values
      const paymentTypeMap: Record<string, string> = {
        "full-payment": "FULL_PAYMENT",
        "installment-payment": "PARTIAL_PAYMENT",
        credit: "PARTIAL_PAYMENT",
        "FULL_PAYMENT": "FULL_PAYMENT",
        "PARTIAL_PAYMENT": "PARTIAL_PAYMENT",
      }
      const apiPaymentType = paymentTypeMap[orderData.paymentType] || "FULL_PAYMENT"

      // Map deliveryMethod to backend enum values
      const deliveryMethodMap: Record<string, string> = {
        express: "EXPRESS",
        normal: "REGULAR",
        EXPRESS: "EXPRESS",
        REGULAR: "REGULAR",
        STANDARD: "REGULAR",
      }
      const apiDeliveryMethod = deliveryMethodMap[orderData.deliveryMethod] || "REGULAR"

      // Validate deliveryId is present
      if (!orderData.deliveryId) {
        throw new Error("Delivery ID is required. Please select a delivery address.")
      }

      // Build payload matching backend model structure
      // Note: orderId, amountPaid, paid, status, and dateOrdered are generated by backend
      const payload: Record<string, any> = {
        pharmacyId,
        totalCost: Number.isFinite(Number(orderData.totalCost)) ? Number(orderData.totalCost) : 0,
        discount: Number.isFinite(Number(orderData.discount)) ? Number(orderData.discount) : 0,
        amountPayable: Number.isFinite(Number(orderData.amountPayable)) ? Number(orderData.amountPayable) : 0,
        deliveryMethod: apiDeliveryMethod,
        paymentMethod: apiPaymentMethod,
        paymentType: apiPaymentType,
        numberOfItems: Number.isFinite(Number(orderData.numberOfItems)) ? Number(orderData.numberOfItems) : 0,
        deliveryId: orderData.deliveryId, // Required: ID of the selected delivery address
        itemList: orderData.itemList.map((item) => ({
          productId: item.productId,
          quantity: Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 0,
        })),
      }

      const response = await axios.post(`/api/orders`, payload, { withCredentials: true })
      const raw =
        response.data?.data?.order ||
        response.data?.data ||
        response.data?.order ||
        (Array.isArray(response.data) ? response.data[0] : null) ||
        { ...payload, status: "pending", _id: `order-${Date.now()}` }

      // Map paymentMethod from API format to frontend format
      const paymentMethodValue = String(raw?.paymentMethod || payload.paymentMethod || "").toUpperCase()
      let mappedPaymentMethod = "cash-on-delivery"
      if (paymentMethodValue === "PAYMENT_ON_ONLINE" || paymentMethodValue.includes("ONLINE")) mappedPaymentMethod = "online-payment"
      else if (paymentMethodValue === "PAYMENT_ON_DELIVERY" || paymentMethodValue.includes("DELIVERY")) mappedPaymentMethod = "cash-on-delivery"
      else mappedPaymentMethod = paymentMethodValue.toLowerCase().replace(/_/g, "-")

      // Map paymentType from API format to frontend format
      const paymentTypeValue = String(raw?.paymentType || payload.paymentType || "").toUpperCase()
      let mappedPaymentType = "full-payment"
      if (paymentTypeValue === "FULL_PAYMENT") mappedPaymentType = "full-payment"
      else if (paymentTypeValue === "PARTIAL_PAYMENT" || paymentTypeValue.includes("INSTALL")) mappedPaymentType = "installment-payment"
      else if (paymentTypeValue.includes("CREDIT")) mappedPaymentType = "credit"
      else mappedPaymentType = paymentTypeValue.toLowerCase().replace(/_/g, "-")

      const order: Order = {
        id: raw?.orderId || raw?._id || raw?.id || payload.itemList[0]?.productId || `order-${Date.now()}`,
        orderNumber: raw?.orderNumber || raw?.orderNo || raw?.reference || raw?.orderId || payload.paymentReference,
        pharmacyId: raw?.pharmacyId || raw?.organizationId || pharmacyId,
        totalCost: Number.isFinite(Number(raw?.totalCost ?? raw?.totalAmount ?? raw?.total))
          ? Number(raw?.totalCost ?? raw?.totalAmount ?? raw?.total)
          : payload.totalCost,
        deliveryMethod: raw?.deliveryMethod || payload.deliveryMethod,
        paymentType: mappedPaymentType,
        paymentMethod: mappedPaymentMethod,
        numberOfItems: raw?.numberOfItems || payload.numberOfItems,
        status: (() => {
          const value = String(raw?.status || raw?.orderStatus || "").toUpperCase()
          if (value === "PENDING") return "pending"
          else if (value === "PROCESSING") return "processing"
          else if (value === "SHIPPED" || value.includes("SHIP") || value.includes("TRANSIT")) return "shipped"
          else if (value === "DELIVERED" || value.includes("DELIVER") || value.includes("COMPLETE")) return "delivered"
          else if (value === "CANCELLED" || value.includes("CANCEL") || value.includes("REJECT") || value.includes("DECLINE")) return "cancelled"
          return value.toLowerCase() || "pending"
        })(),
        items: Array.isArray(raw?.products || raw?.itemList || raw?.items)
          ? (raw?.products || raw?.itemList || raw?.items).map((item: any, idx: number) => ({
              productId: item?.productId || item?.id || `product-${idx}`,
              quantity: Number.isFinite(Number(item?.quantity)) ? Number(item.quantity) : 1,
              name: item?.productName || item?.name,
              price: item?.price,
              ...item,
            }))
          : payload.itemList,
        raw,
        createdAt: raw?.dateOrdered || raw?.createdAt || raw?.dateCreated,
        updatedAt: raw?.updatedAt || raw?.lastUpdated,
      }

      set({
        orders: [
          order,
          ...get().orders.filter((existing) => existing.id !== order.id),
        ],
        selectedOrder: order,
        isLoading: false,
      })

      return order
        } catch (error: any) {
          console.error("Order creation error:", error)
      const message = error.response?.data?.message || error.message || "Failed to create order"
      set({ error: message, isLoading: false })
      throw new Error(message)
        }
      },

      cancelOrder: async (orderId: string, reason?: string) => {
        set({ isLoading: true, error: null })
        try {
      const base = process.env.NEXT_PUBLIC_MARKET_URL
      if (!base) throw new Error("NEXT_PUBLIC_MARKET_URL is not configured")

      const response = await axios.patch(
        `${base.replace(/\/$/, "")}/order/cancel/${orderId}`,
        { reason },
        { withCredentials: true },
      )

      const raw =
        response.data?.data?.order ||
        response.data?.data ||
        response.data?.order ||
        (Array.isArray(response.data) ? response.data[0] : null)

      if (!raw) throw new Error("Failed to cancel order")

      // Handle products array
      const itemsSource = raw?.products || raw?.itemList || raw?.items || []
      const items = Array.isArray(itemsSource)
        ? itemsSource.map((item: any, idx: number) => {
            const quantity = Number.isFinite(Number(item?.quantity))
              ? Number(item.quantity)
              : raw?.numberOfItems && itemsSource.length > 0
              ? Math.floor((raw.numberOfItems || 0) / itemsSource.length)
              : 1

            return {
              productId: item?.productId || item?.id || `product-${idx}`,
              quantity,
              name: item?.productName || item?.name,
              price: item?.price,
              ...item,
            }
          })
        : []

      // Map paymentMethod
      const paymentMethodValue = String(raw?.paymentMethod || "").toUpperCase()
      let mappedPaymentMethod = "cash-on-delivery"
      if (paymentMethodValue === "PAYMENT_ON_ONLINE" || paymentMethodValue.includes("ONLINE")) mappedPaymentMethod = "online-payment"
      else if (paymentMethodValue === "PAYMENT_ON_DELIVERY" || paymentMethodValue.includes("DELIVERY")) mappedPaymentMethod = "cash-on-delivery"
      else mappedPaymentMethod = paymentMethodValue.toLowerCase().replace(/_/g, "-")

      // Map paymentType
      const paymentTypeValue = String(raw?.paymentType || "").toUpperCase()
      let mappedPaymentType = "full-payment"
      if (paymentTypeValue === "FULL_PAYMENT") mappedPaymentType = "full-payment"
      else if (paymentTypeValue === "PARTIAL_PAYMENT" || paymentTypeValue.includes("INSTALL")) mappedPaymentType = "installment-payment"
      else if (paymentTypeValue.includes("CREDIT")) mappedPaymentType = "credit"
      else mappedPaymentType = paymentTypeValue.toLowerCase().replace(/_/g, "-")

      // Map status
      const statusValue = String(raw?.status || raw?.orderStatus || "").toUpperCase()
      let mappedStatus = "pending"
      if (statusValue === "PENDING") mappedStatus = "pending"
      else if (statusValue === "PROCESSING") mappedStatus = "processing"
      else if (statusValue === "SHIPPED" || statusValue.includes("SHIP") || statusValue.includes("TRANSIT")) mappedStatus = "shipped"
      else if (statusValue === "DELIVERED" || statusValue.includes("DELIVER") || statusValue.includes("COMPLETE")) mappedStatus = "delivered"
      else if (statusValue === "CANCELLED" || statusValue.includes("CANCEL") || statusValue.includes("REJECT") || statusValue.includes("DECLINE")) mappedStatus = "cancelled"
      else mappedStatus = statusValue.toLowerCase()

      const updated: Order = {
        id: raw?.orderId || raw?._id || raw?.id || orderId,
        orderNumber: raw?.orderNumber || raw?.orderNo || raw?.reference || raw?.orderId || orderId,
        pharmacyId: raw?.pharmacyId || raw?.organizationId,
        totalCost: Number.isFinite(Number(raw?.totalCost ?? raw?.totalAmount ?? raw?.total))
          ? Number(raw?.totalCost ?? raw?.totalAmount ?? raw?.total)
          : undefined,
        deliveryMethod: raw?.deliveryMethod,
        paymentType: mappedPaymentType,
        paymentMethod: mappedPaymentMethod,
        numberOfItems: raw?.numberOfItems ?? (items.length > 0 ? items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) : undefined),
        status: mappedStatus,
        items,
        raw,
        createdAt: raw?.dateOrdered || raw?.createdAt || raw?.dateCreated,
        updatedAt: raw?.updatedAt || raw?.lastUpdated,
      }
            
            set({ 
        orders: [
          updated,
          ...get().orders.filter((existing) => existing.id !== updated.id),
        ],
        selectedOrder: get().selectedOrder?.id === updated.id ? updated : get().selectedOrder,
        isLoading: false,
      })
        } catch (error: any) {
      console.error("Error cancelling order:", error)
      const message = error.response?.data?.message || error.message || "Failed to cancel order"
      set({ error: message, isLoading: false })
      throw new Error(message)
        }
      },

      selectOrder: (order) => {
        set({ selectedOrder: order })
      },

    clearError: () => {
      set({ error: null })
    },
}))
