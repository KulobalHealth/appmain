import { create } from "zustand"
import { devtools } from "zustand/middleware"
import axios from "axios"
import type { Payment } from "@/types/payment"

interface PaymentResponse {
  payment: Payment
}

interface PaymentsResponse {
  payments: Payment[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface PaymentStats {
  total: number
  completed: number
  pending: number
  failed: number
  totalAmount: number
  cardPayments: number
  mobileMoneyPayments: number
  byNetwork: Record<string, number>
  byCardType: Record<string, number>
}

interface PaymentState {
  // Payment data
  payments: Payment[]
  filteredPayments: Payment[]
  selectedPayment: Payment | null
  stats: PaymentStats | null

  // UI state
  isLoading: boolean
  error: string | null
  filterType: "all" | "card" | "mobile_money" | "cash on delivery" | "credit" | null
  filterStatus: Payment["status"] | null
  filterUserId: string | null

  // Actions
  fetchPayments: () => Promise<void>
  fetchPaymentsByUser: (userId: string) => Promise<void>
  fetchPaymentByTransactionId: (transactionId: string) => Promise<void>
  fetchPaymentsByStatus: (status: Payment["status"]) => Promise<void>
  fetchPaymentsByType: (paymentType: "card" | "mobile_money" | "cash on delivery" | "credit") => Promise<void>
  fetchPaymentStats: () => Promise<void>

  createNewPayment: (paymentData: {
    amount: number
    currency?: string
    paymentType: 'card' | 'mobile_money' | 'cash on delivery' | 'credit'
    paymentMethod: {
      type: 'card' | 'mobile_money' | 'cash'
      cardType?: 'visa' | 'mastercard' | 'american_express' | 'discover'
      last4Digits?: string
      expiryMonth?: string
      expiryYear?: string
      cardholderName?: string
      issuerBank?: string
      network?: 'mtn' | 'vodafone' | 'airteltigo' | 'telecel'
      phoneNumber?: string
      accountName?: string
      networkDisplayName?: string
    }
    description: string
    metadata?: {
      orderId: string
      paymentType: 'full-payment' | 'partial-payment' | 'deposit' | 'installment-payment'
      paymentMethod: 'pay-on-delivery' | 'online-payment' | 'mobile-money' | 'cash-on-delivery' | 'pay-online'
      pharmacyName: string
      shippingDetails: {
        pharmacyName: string
        phoneNumber: string
        pharmacyEmail: string
        pharmacyLocation: string
        streetAddress?: string
        gpsAddress?: string
      }
      items: Array<{
        id: string
        name: string
        quantity: number
        price: number
        category?: string
        image?: string
      }>
      itemsSummary: string
      notes?: string
      installmentPercentage?: number
      remainingBalance?: number
      cardType?: string
      last4Digits?: string
      cardholderName?: string
      network?: string
      phoneNumber?: string
    }
  }) => Promise<Payment>

  simulateNewPayment: (
    userId: string,
    amount: number,
    description: string, 
    paymentType: "card" | "mobile_money" | "cash on delivery" | "credit",
    metadata?: Record<string, unknown>,
  ) => Promise<Payment>

  updateStatus: (id: string, status: Payment["status"], metadata?: Record<string, unknown>) => Promise<void>

  // Filters
  setFilterType: (type: "all" | "card" | "mobile_money" | "cash on delivery" | "credit") => void
  setFilterStatus: (status: Payment["status"] | null) => void
  setFilterUserId: (userId: string | null) => void
  clearFilters: () => void

  // Selection
  selectPayment: (payment: Payment | null) => void
}

export const usePaymentStore = create<PaymentState>()(
  devtools(
    (set, get) => ({
      // Initial state
        payments: [],
        filteredPayments: [],
        selectedPayment: null,
        stats: null,
        isLoading: false,
        error: null,
        filterType: null,
        filterStatus: null as Payment["status"] | null,
        filterUserId: null,

        // Fetch actions
        fetchPayments: async () => {
          set({ isLoading: true, error: null })
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/payments/my-payments`, { withCredentials: true })
            
            if (!response.data.success) {
              throw new Error(response.data.message || "Failed to fetch payments")
            }
            
            const payments = response.data.data?.payments.map((apiPayment: any) => ({
              id: apiPayment._id,
              userId: apiPayment.userId,
              transactionId: apiPayment.transactionId,
              amount: apiPayment.amount,
              currency: apiPayment.currency,
              paymentType: apiPayment.paymentType,
              paymentMethod: apiPayment.paymentMethod,
              status: apiPayment.status,
              description: apiPayment.description,
              metadata: apiPayment.metadata,
              createdAt: apiPayment.createdAt,
              updatedAt: apiPayment.updatedAt,
            })) || []

            set({ 
              payments, 
              filteredPayments: payments,
              isLoading: false 
            })
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch payments"
            set({ error: errorMessage, isLoading: false })
          }
        },

        fetchPaymentsByUser: async (userId: string) => {
          set({ isLoading: true, error: null })
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/payments/user/${userId}`, { withCredentials: true })
            
            if (!response.data.success) {
              throw new Error(response.data.message || "Failed to fetch user payments")
            }
            
            const payments = response.data.data?.payments.map((apiPayment: any) => ({
              id: apiPayment._id,
              userId: apiPayment.userId,
              transactionId: apiPayment.transactionId,
              amount: apiPayment.amount,
              currency: apiPayment.currency,
              paymentType: apiPayment.paymentType,
              paymentMethod: apiPayment.paymentMethod,
              status: apiPayment.status,
              description: apiPayment.description,
              metadata: apiPayment.metadata,
              createdAt: apiPayment.createdAt,
              updatedAt: apiPayment.updatedAt,
            })) || []

            set({ 
              payments, 
              filteredPayments: payments,
              isLoading: false 
            })
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch user payments"
            set({ error: errorMessage, isLoading: false })
          }
        },

        fetchPaymentByTransactionId: async (transactionId: string) => {
          set({ isLoading: true, error: null })
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/payments/transaction/${transactionId}`, { withCredentials: true })
            
            if (!response.data.success) {
              throw new Error(response.data.message || "Failed to fetch payment")
            }
            
            const apiPayment = response.data.data?.payment
            if (apiPayment) {
              const payment: Payment = {
                id: apiPayment._id,
                userId: apiPayment.userId,
                transactionId: apiPayment.transactionId,
                amount: apiPayment.amount,
                currency: apiPayment.currency,
                paymentType: apiPayment.paymentType,
                paymentMethod: apiPayment.paymentMethod,
                status: apiPayment.status,
                description: apiPayment.description,
                metadata: apiPayment.metadata,
                createdAt: apiPayment.createdAt,
                updatedAt: apiPayment.updatedAt,
              }

              set({ 
                selectedPayment: payment,
                isLoading: false 
              })
            }
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch payment"
            set({ error: errorMessage, isLoading: false })
          }
        },

        fetchPaymentsByStatus: async (status: Payment["status"]) => {
          set({ isLoading: true, error: null })
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/payments/my-payments?status=${status}`, { withCredentials: true })
            
            if (!response.data.success) {
              throw new Error(response.data.message || "Failed to fetch payments by status")
            }
            
            const payments = response.data.data?.payments.map((apiPayment: any) => ({
              id: apiPayment._id,
              userId: apiPayment.userId,
              transactionId: apiPayment.transactionId,
              amount: apiPayment.amount,
              currency: apiPayment.currency,
              paymentType: apiPayment.paymentType,
              paymentMethod: apiPayment.paymentMethod,
              status: apiPayment.status,
              description: apiPayment.description,
              metadata: apiPayment.metadata,
              createdAt: apiPayment.createdAt,
              updatedAt: apiPayment.updatedAt,
            })) || []

            set({ 
              payments, 
              filteredPayments: payments,
              isLoading: false 
            })
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch payments by status"
            set({ error: errorMessage, isLoading: false })
          }
        },

        fetchPaymentsByType: async (paymentType: "card" | "mobile_money" | "cash on delivery" | "credit") => {
          set({ isLoading: true, error: null })
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/payments/my-payments?paymentType=${paymentType}`, { withCredentials: true })
            
            if (!response.data.success) {
              throw new Error(response.data.message || "Failed to fetch payments by type")
            }
            
            const payments = response.data.data?.payments.map((apiPayment: any) => ({
              id: apiPayment._id,
              userId: apiPayment.userId,
              transactionId: apiPayment.transactionId,
              amount: apiPayment.amount,
              currency: apiPayment.currency,
              paymentType: apiPayment.paymentType,
              paymentMethod: apiPayment.paymentMethod,
              status: apiPayment.status,
              description: apiPayment.description,
              metadata: apiPayment.metadata,
              createdAt: apiPayment.createdAt,
              updatedAt: apiPayment.updatedAt,
            })) || []

            set({ 
              payments, 
              filteredPayments: payments,
              isLoading: false 
            })
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch payments by type"
            set({ error: errorMessage, isLoading: false })
          }
        },

        fetchPaymentStats: async () => {
          set({ isLoading: true, error: null })
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/payments/stats`, { withCredentials: true })
            
            if (!response.data.success) {
              throw new Error(response.data.message || "Failed to fetch payment stats")
            }
            
            set({ 
              stats: response.data.data || null,
              isLoading: false 
            })
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch payment stats"
            set({ error: errorMessage, isLoading: false })
          }
        },

        createNewPayment: async (paymentData) => {
          console.log(paymentData)
          set({ isLoading: true, error: null })
          try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/payments`, paymentData, { withCredentials: true })
            
            if (!response.data.success) {
              throw new Error(response.data.message || "Failed to create payment")
            }
            
            const apiPayment = response.data.data?.payment
            if (apiPayment) {
              const payment: Payment = {
                id: apiPayment._id,
                userId: apiPayment.userId,
                transactionId: apiPayment.transactionId,
                amount: apiPayment.amount,
                currency: apiPayment.currency,
                paymentType: apiPayment.paymentType,
                paymentMethod: apiPayment.paymentMethod,
                status: apiPayment.status,
                description: apiPayment.description,
                metadata: apiPayment.metadata,
                createdAt: apiPayment.createdAt,
                updatedAt: apiPayment.updatedAt,
              }

              const currentPayments = get().payments
              set({ 
                payments: [payment, ...currentPayments],
                filteredPayments: [payment, ...get().filteredPayments],
                isLoading: false 
              })

              return payment
            }
            
            throw new Error("Payment creation failed")
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to create payment"
            set({ error: errorMessage, isLoading: false })
            throw new Error(errorMessage)
          }
        },

        simulateNewPayment: async (userId, amount, description, paymentType, metadata) => {
          // This is a mock implementation - you can replace with actual API call
          const mockPayment: Payment = {
            id: `mock_${Date.now()}`,
            userId,
            transactionId: `TXN_${Date.now()}`,
            amount,
            currency: 'GHS',
            paymentType,
            paymentMethod: {
              type: paymentType === 'card' ? 'card' : paymentType === 'mobile_money' ? 'mobile_money' : 'cash',
              network: paymentType === 'mobile_money' ? 'mtn' : undefined,
              phoneNumber: paymentType === 'mobile_money' ? '+233123456789' : undefined,
            },
            status: 'pending',
            description,
            metadata: metadata as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          const currentPayments = get().payments
          set({ 
            payments: [mockPayment, ...currentPayments],
            filteredPayments: [mockPayment, ...get().filteredPayments],
          })

          return mockPayment
        },

        updateStatus: async (id: string, status: Payment["status"], metadata?: Record<string, unknown>) => {
          try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/payments/${id}/status`, {
              status,
              metadata
            }, { withCredentials: true })
            
            if (!response.data.success) {
              throw new Error(response.data.message || "Failed to update payment status")
            }
            
            const apiPayment = response.data.data?.payment
            if (apiPayment) {
              const updatedPayment: Payment = {
                id: apiPayment._id,
                userId: apiPayment.userId,
                transactionId: apiPayment.transactionId,
                amount: apiPayment.amount,
                currency: apiPayment.currency,
                paymentType: apiPayment.paymentType,
                paymentMethod: apiPayment.paymentMethod,
                status: apiPayment.status,
                description: apiPayment.description,
                metadata: apiPayment.metadata,
                createdAt: apiPayment.createdAt,
                updatedAt: apiPayment.updatedAt,
              }

              const currentPayments = get().payments
              const updatedPayments = currentPayments.map(p => 
                p.id === id ? updatedPayment : p
              )

              const currentFilteredPayments = get().filteredPayments
              const updatedFilteredPayments = currentFilteredPayments.map(p => 
                p.id === id ? updatedPayment : p
              )

              set({ 
                payments: updatedPayments,
                filteredPayments: updatedFilteredPayments,
                selectedPayment: get().selectedPayment?.id === id ? updatedPayment : get().selectedPayment,
              })
            }
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to update payment status"
            set({ error: errorMessage })
            throw new Error(errorMessage)
          }
        },

        // Filters
        setFilterType: (type) => {
          set({ filterType: type })
          const { payments, filterStatus, filterUserId } = get()
          
          let filtered = payments
          
          if (type && type !== 'all') {
            filtered = filtered.filter(p => p.paymentType === type)
          }
          
          if (filterStatus) {
            filtered = filtered.filter(p => p.status === filterStatus)
          }
          
          if (filterUserId) {
            filtered = filtered.filter(p => p.userId === filterUserId)
          }
          
          set({ filteredPayments: filtered })
        },

        setFilterStatus: (status) => {
          set({ filterStatus: status })
          const { payments, filterType, filterUserId } = get()
          
          let filtered = payments
          
          if (filterType && filterType !== 'all') {
            filtered = filtered.filter(p => p.paymentType === filterType)
          }
          
          if (status) {
            filtered = filtered.filter(p => p.status === status)
          }
          
          if (filterUserId) {
            filtered = filtered.filter(p => p.userId === filterUserId)
          }
          
          set({ filteredPayments: filtered })
        },

        setFilterUserId: (userId) => {
          set({ filterUserId: userId })
          const { payments, filterType, filterStatus } = get()
          
          let filtered = payments
          
          if (filterType && filterType !== 'all') {
            filtered = filtered.filter(p => p.paymentType === filterType)
          }
          
          if (filterStatus) {
            filtered = filtered.filter(p => p.status === filterStatus)
          }
          
          if (userId) {
            filtered = filtered.filter(p => p.userId === userId)
          }
          
          set({ filteredPayments: filtered })
        },

        clearFilters: () => {
          const { payments } = get()
          set({ 
            filterType: null,
            filterStatus: null,
            filterUserId: null,
            filteredPayments: payments
          })
        },

        // Selection
        selectPayment: (payment) => {
          set({ selectedPayment: payment })
      },
    }),
  ),
)

// Selector hooks for common use cases
export const usePayments = () => usePaymentStore((state) => state.payments)
export const useFilteredPayments = () => usePaymentStore((state) => state.filteredPayments)
export const useSelectedPayment = () => usePaymentStore((state) => state.selectedPayment)
export const usePaymentStats = () => usePaymentStore((state) => state.stats)
export const usePaymentLoading = () => usePaymentStore((state) => state.isLoading)
export const usePaymentError = () => usePaymentStore((state) => state.error)