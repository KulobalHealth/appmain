import { create } from "zustand"
import axios from "axios"
import { useAuthStore } from "./auth-store"

export interface Allergy {
  id?: string
  pharmacyId: string
  patientUuid: string
  allergyName: string
  allergyDescription: string
  allergySeverity: "low" | "medium" | "high"
  allergyType: "food" | "environment" | "medication" | "other"
  allergyReaction: "skin" | "respiratory" | "digestive" | "other"
  medicallyVerified: boolean
  reportedBy: "patient" | "doctor" | "pharmacist" | "system"
  status: "active" | "inactive" | "resolved"
  onsetDate: string
  createdAt?: string
  updatedAt?: string
}

interface AllergyState {
  allergies: Allergy[]
  isLoading: boolean
  error: string | null
}

interface AllergyActions {
  fetchPatientAllergies: (patientUuid: string) => Promise<void>
  addAllergy: (allergyData: Omit<Allergy, "id" | "createdAt" | "updatedAt">) => Promise<{ success: boolean; error?: string }>
  deleteAllergy: (allergyId: string, patientUuid: string) => Promise<{ success: boolean; error?: string }>
  clearError: () => void
}

type AllergyStore = AllergyState & AllergyActions

const getPharmacyId = (): string | null => {
  const user = useAuthStore.getState().user
  if (!user) return null
  return user.pharmacyId || null
}

// Use local API proxy to forward auth cookies properly
const getApiUrl = (): string => {
  return "/api/allergies"
}

export const useAllergyStore = create<AllergyStore>()((set, get) => ({
  allergies: [],
  isLoading: false,
  error: null,

  fetchPatientAllergies: async (patientUuid: string) => {
    set({ isLoading: true, error: null })
    try {
      const url = `/api/allergies/patient/${patientUuid}`
      console.log("[AllergyStore] fetchPatientAllergies - URL:", url)

      const response = await axios.get(url, {
        withCredentials: true,
      })

      console.log("[AllergyStore] fetchPatientAllergies - Response status:", response.status)
      console.log("[AllergyStore] fetchPatientAllergies - Response data:", response.data)

      let allergiesData = []

      if (response.data?.status === "success" && response.data?.data && Array.isArray(response.data.data)) {
        console.log("[AllergyStore] fetchPatientAllergies - Success with status.data:", response.data.data)
        allergiesData = response.data.data
      } else if (response.data?.success && response.data?.data && Array.isArray(response.data.data)) {
        console.log("[AllergyStore] fetchPatientAllergies - Success with success.data:", response.data.data)
        allergiesData = response.data.data
      } else if (Array.isArray(response.data)) {
        console.log("[AllergyStore] fetchPatientAllergies - Success with array:", response.data)
        allergiesData = response.data
      } else if (Array.isArray(response.data?.data)) {
        console.log("[AllergyStore] fetchPatientAllergies - Success with data array:", response.data.data)
        allergiesData = response.data.data
      } else {
        console.warn("[AllergyStore] fetchPatientAllergies - Unexpected response format:", response.data)
        set({ allergies: [], isLoading: false })
        return
      }

      // Transform allergy objects if needed
      const transformedAllergies: Allergy[] = allergiesData.map((allergy: any) => ({
        id: allergy.id || allergy.allergyId,
        pharmacyId: allergy.pharmacyId || "",
        patientUuid: allergy.patientUuid || allergy.patientId || "",
        allergyName: allergy.allergyName || "",
        allergyDescription: allergy.allergyDescription || "",
        allergySeverity: allergy.allergySeverity || "low",
        allergyType: allergy.allergyType || "other",
        allergyReaction: allergy.allergyReaction || "other",
        medicallyVerified: allergy.medicallyVerified || false,
        reportedBy: allergy.reportedBy || "patient",
        status: allergy.status || "active",
        onsetDate: allergy.onsetDate || "",
        createdAt: allergy.createdAt,
        updatedAt: allergy.updatedAt,
      }))

      console.log("[AllergyStore] fetchPatientAllergies - Transformed allergies:", transformedAllergies)
      set({ allergies: transformedAllergies, isLoading: false })
    } catch (error: any) {
      console.error("[AllergyStore] fetchPatientAllergies - Error:", error)
      console.error("[AllergyStore] fetchPatientAllergies - Error response:", error.response)
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch allergies"
      set({ error: errorMessage, isLoading: false })
    }
  },

  addAllergy: async (allergyData: Omit<Allergy, "id" | "createdAt" | "updatedAt">) => {
    set({ isLoading: true, error: null })
    try {
      const pharmacyId = getPharmacyId()
      if (!pharmacyId) {
        set({ error: "Pharmacy ID not found. Please log in again.", isLoading: false })
        return { success: false, error: "Pharmacy ID not found" }
      }

      const url = getApiUrl()
      console.log("[AllergyStore] addAllergy - URL:", url)
      console.log("[AllergyStore] addAllergy - Payload:", { ...allergyData, pharmacyId })

      const payload = {
        ...allergyData,
        pharmacyId,
      }

      const response = await axios.post(url, payload, {
        withCredentials: true,
      })

      console.log("[AllergyStore] addAllergy - Response status:", response.status)
      console.log("[AllergyStore] addAllergy - Response data:", response.data)

      if (response.data?.status === "success" || response.data?.success || response.status === 201 || response.status === 200) {
        // Refresh allergies for the patient
        await get().fetchPatientAllergies(allergyData.patientUuid)
        set({ isLoading: false })
        return { success: true }
      } else {
        const errorMessage = response.data?.message || "Failed to add allergy"
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      console.error("[AllergyStore] addAllergy - Error:", error)
      console.error("[AllergyStore] addAllergy - Error response:", error.response)
      const errorMessage = error.response?.data?.message || error.message || "Failed to add allergy"
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  deleteAllergy: async (allergyId: string, patientUuid: string) => {
    set({ isLoading: true, error: null })
    try {
      const url = `/api/allergies/${allergyId}`
      console.log("[AllergyStore] deleteAllergy - URL:", url)

      const response = await axios.delete(url, {
        withCredentials: true,
      })

      console.log("[AllergyStore] deleteAllergy - Response status:", response.status)
      console.log("[AllergyStore] deleteAllergy - Response data:", response.data)

      if (response.data?.status === "success" || response.data?.success || response.status === 200 || response.status === 204) {
        // Refresh allergies for the patient
        await get().fetchPatientAllergies(patientUuid)
        set({ isLoading: false })
        return { success: true }
      } else {
        const errorMessage = response.data?.message || "Failed to delete allergy"
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      console.error("[AllergyStore] deleteAllergy - Error:", error)
      console.error("[AllergyStore] deleteAllergy - Error response:", error.response)
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete allergy"
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  clearError: () => set({ error: null }),
}))

