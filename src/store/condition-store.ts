import { create } from "zustand"
import axios from "axios"
import { useAuthStore } from "./auth-store"

export interface Condition {
  id?: string
  pharmacyId: string
  patientUuid: string
  diseaseName: string
  diseaseCode: string
  category: string
  severity: "mild" | "moderate" | "severe"
  chronic: boolean
  diagnosedDate: string
  status: "active" | "inactive" | "resolved"
  diagnosedBy: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

interface ConditionState {
  conditions: Condition[]
  isLoading: boolean
  error: string | null
}

interface ConditionActions {
  fetchPatientConditions: (patientUuid: string) => Promise<void>
  addCondition: (conditionData: Omit<Condition, "id" | "createdAt" | "updatedAt">) => Promise<{ success: boolean; error?: string }>
  deleteCondition: (conditionId: string, patientUuid: string) => Promise<{ success: boolean; error?: string }>
  clearError: () => void
}

type ConditionStore = ConditionState & ConditionActions

const getPharmacyId = (): string | null => {
  const user = useAuthStore.getState().user
  if (!user) return null
  return user.pharmacyId || null
}

// Use local API proxy to forward auth cookies properly
const getApiUrl = (): string => {
  return "/api/conditions"
}

export const useConditionStore = create<ConditionStore>()((set, get) => ({
  conditions: [],
  isLoading: false,
  error: null,

  fetchPatientConditions: async (patientUuid: string) => {
    set({ isLoading: true, error: null })
    try {
      const url = `/api/conditions/patient/${patientUuid}`
      console.log("[ConditionStore] fetchPatientConditions - URL:", url)

      const response = await axios.get(url, {
        withCredentials: true,
      })

      console.log("[ConditionStore] fetchPatientConditions - Response status:", response.status)
      console.log("[ConditionStore] fetchPatientConditions - Response data:", response.data)

      let conditionsData = []

      if (response.data?.status === "success" && response.data?.data && Array.isArray(response.data.data)) {
        console.log("[ConditionStore] fetchPatientConditions - Success with status.data:", response.data.data)
        conditionsData = response.data.data
      } else if (response.data?.success && response.data?.data && Array.isArray(response.data.data)) {
        console.log("[ConditionStore] fetchPatientConditions - Success with success.data:", response.data.data)
        conditionsData = response.data.data
      } else if (Array.isArray(response.data)) {
        console.log("[ConditionStore] fetchPatientConditions - Success with array:", response.data)
        conditionsData = response.data
      } else if (Array.isArray(response.data?.data)) {
        console.log("[ConditionStore] fetchPatientConditions - Success with data array:", response.data.data)
        conditionsData = response.data.data
      } else {
        console.warn("[ConditionStore] fetchPatientConditions - Unexpected response format:", response.data)
        set({ conditions: [], isLoading: false })
        return
      }

      // Transform condition objects if needed
      const transformedConditions: Condition[] = conditionsData.map((condition: any) => ({
        id: condition.id || condition.conditionId,
        pharmacyId: condition.pharmacyId || "",
        patientUuid: condition.patientUuid || condition.patientId || "",
        diseaseName: condition.diseaseName || "",
        diseaseCode: condition.diseaseCode || "",
        category: condition.category || "",
        severity: condition.severity || "mild",
        chronic: condition.chronic || false,
        diagnosedDate: condition.diagnosedDate || "",
        status: condition.status || "active",
        diagnosedBy: condition.diagnosedBy || "",
        notes: condition.notes || "",
        createdAt: condition.createdAt,
        updatedAt: condition.updatedAt,
      }))

      console.log("[ConditionStore] fetchPatientConditions - Transformed conditions:", transformedConditions)
      set({ conditions: transformedConditions, isLoading: false })
    } catch (error: any) {
      console.error("[ConditionStore] fetchPatientConditions - Error:", error)
      console.error("[ConditionStore] fetchPatientConditions - Error response:", error.response)
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch conditions"
      set({ error: errorMessage, isLoading: false })
    }
  },

  addCondition: async (conditionData: Omit<Condition, "id" | "createdAt" | "updatedAt">) => {
    set({ isLoading: true, error: null })
    try {
      const pharmacyId = getPharmacyId()
      if (!pharmacyId) {
        set({ error: "Pharmacy ID not found. Please log in again.", isLoading: false })
        return { success: false, error: "Pharmacy ID not found" }
      }

      const url = getApiUrl()
      console.log("[ConditionStore] addCondition - URL:", url)
      console.log("[ConditionStore] addCondition - Payload:", { ...conditionData, pharmacyId })

      const payload = {
        ...conditionData,
        pharmacyId,
      }

      const response = await axios.post(url, payload, {
        withCredentials: true,
      })

      console.log("[ConditionStore] addCondition - Response status:", response.status)
      console.log("[ConditionStore] addCondition - Response data:", response.data)

      if (response.data?.status === "success" || response.data?.success || response.status === 201 || response.status === 200) {
        // Refresh conditions for the patient
        await get().fetchPatientConditions(conditionData.patientUuid)
        set({ isLoading: false })
        return { success: true }
      } else {
        const errorMessage = response.data?.message || "Failed to add condition"
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      console.error("[ConditionStore] addCondition - Error:", error)
      console.error("[ConditionStore] addCondition - Error response:", error.response)
      const errorMessage = error.response?.data?.message || error.message || "Failed to add condition"
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  deleteCondition: async (conditionId: string, patientUuid: string) => {
    set({ isLoading: true, error: null })
    try {
      const url = `/api/conditions/${conditionId}`
      console.log("[ConditionStore] deleteCondition - URL:", url)

      const response = await axios.delete(url, {
        withCredentials: true,
      })

      console.log("[ConditionStore] deleteCondition - Response status:", response.status)
      console.log("[ConditionStore] deleteCondition - Response data:", response.data)

      if (response.data?.status === "success" || response.data?.success || response.status === 200 || response.status === 204) {
        // Refresh conditions for the patient
        await get().fetchPatientConditions(patientUuid)
        set({ isLoading: false })
        return { success: true }
      } else {
        const errorMessage = response.data?.message || "Failed to delete condition"
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      console.error("[ConditionStore] deleteCondition - Error:", error)
      console.error("[ConditionStore] deleteCondition - Error response:", error.response)
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete condition"
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  clearError: () => set({ error: null }),
}))



