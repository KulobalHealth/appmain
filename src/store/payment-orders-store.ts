import axios from "axios"
import { create } from "zustand"
import { useAuthStore } from "./auth-store"

export type PaymentOrder = {
  id: string
  pharmacyId?: string
  orderId?: string
  amountPaid: number
  reference?: string
  status?: string
  createdAt?: string
  updatedAt?: string
  raw?: Record<string, any>
}

export type CreatePaymentOrderPayload = {
  pharmacyId?: string
  orderId: string
  amountPaid: number
  reference: string
}

type PaymentOrdersStore = {
  payments: PaymentOrder[]
  isLoading: boolean
  error: string | null

  fetchPayments: (pharmacyId?: string) => Promise<void>
  createPayment: (payload: CreatePaymentOrderPayload) => Promise<PaymentOrder>
  clearError: () => void
}

const resolvePharmacyId = (explicitId?: string): string => {
  if (explicitId) return explicitId

  const { user } = useAuthStore.getState()
  const inferred =
    user?.pharmacyId ||
    (typeof user?.pharmacy === "string" ? user?.pharmacy : user?.pharmacy?.pharmacyId)

  if (!inferred) {
    throw new Error("Unable to determine pharmacy ID. Please sign in again.")
  }

  return inferred
}

const toPaymentOrder = (apiPayment: any): PaymentOrder => {
  const id =
    apiPayment?._id ||
    apiPayment?.id ||
    apiPayment?.paymentId ||
    `payment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  return {
    id,
    pharmacyId: apiPayment?.pharmacyId,
    orderId: apiPayment?.orderId,
    amountPaid: Number(apiPayment?.amountPaid ?? apiPayment?.amount ?? 0) || 0,
    reference: apiPayment?.reference || apiPayment?.paymentReference,
    status: apiPayment?.status,
    createdAt: apiPayment?.createdAt || apiPayment?.dateCreated,
    updatedAt: apiPayment?.updatedAt || apiPayment?.lastUpdated,
    raw: apiPayment,
  }
}

const extractPayments = (payload: any): any[] => {
  const candidates = [
    payload?.data?.payments,
    payload?.data?.data,
    payload?.data,
    payload?.payments,
    Array.isArray(payload) ? payload : null,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate
  }

  return []
}

const extractPayment = (payload: any): any | null => {
  const candidates = [
    payload?.data?.payment,
    payload?.data?.data,
    payload?.data,
    payload?.payment,
    payload,
  ]

  for (const candidate of candidates) {
    if (!candidate) continue
    if (Array.isArray(candidate)) return candidate[0] ?? null
    if (typeof candidate === "object") return candidate
  }

  return null
}

export const usePaymentOrdersStore = create<PaymentOrdersStore>()((set, get) => ({
  payments: [],
  isLoading: false,
  error: null,

  fetchPayments: async (pharmacyId) => {
    set({ isLoading: true, error: null })
    try {
      const resolvedPharmacyId = resolvePharmacyId(pharmacyId)
      const url = `/api/payments?pharmacyId=${resolvedPharmacyId}`

      const response = await axios.get(url, { withCredentials: true })
      const payments = extractPayments(response.data).map(toPaymentOrder)

      set({ payments, isLoading: false })
    } catch (error: any) {
      console.error("Error fetching payment orders:", error)
      const message = error.response?.data?.message || error.message || "Failed to fetch payment orders"
      set({ error: message, isLoading: false })
    }
  },

  createPayment: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      const url = `/api/payments`
      const requestBody = {
        pharmacyId: resolvePharmacyId(payload.pharmacyId),
        orderId: payload.orderId,
        amountPaid: payload.amountPaid,
        reference: payload.reference,
      }

      const response = await axios.post(url, requestBody, { withCredentials: true })
      const payment = toPaymentOrder(extractPayment(response.data) || requestBody)

      set({ payments: [payment, ...get().payments], isLoading: false })
      return payment
    } catch (error: any) {
      console.error("Error creating payment order:", error)
      const message = error.response?.data?.message || error.message || "Failed to create payment order"
      set({ error: message, isLoading: false })
      throw new Error(message)
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))

