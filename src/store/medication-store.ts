import { create } from "zustand"
import axios from "axios"
import { useAuthStore } from "./auth-store"

export interface Medication {
  id?: string
  pharmacyId: string
  patientUuid: string
  medicationName: string
  genericName: string
  drugCode: string
  dosage: string
  route: "oral" | "iv" | "im" | "topical"
  frequency: string
  indication: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "stopped" | "on-hold"
  prescribedBy: string
  verifiedByPharmacist: boolean
  notes: string
  createdAt?: string
  updatedAt?: string
}

interface MedicationState {
  medications: Medication[]
  isLoading: boolean
  error: string | null
}

interface MedicationActions {
  fetchPatientMedications: (patientUuid: string) => Promise<void>
  addMedication: (medicationData: Omit<Medication, "id" | "createdAt" | "updatedAt">) => Promise<{ success: boolean; error?: string }>
  deleteMedication: (medicationId: string, patientUuid: string) => Promise<{ success: boolean; error?: string }>
  clearError: () => void
}

type MedicationStore = MedicationState & MedicationActions

const getPharmacyId = (): string | null => {
  const user = useAuthStore.getState().user
  if (!user) return null
  return user.pharmacyId || null
}

const getPharmacyUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_PHARMACY_URL || "http://localhost:4000"
  return url
}

export const useMedicationStore = create<MedicationStore>()((set, get) => ({
  medications: [],
  isLoading: false,
  error: null,

  fetchPatientMedications: async (patientUuid: string) => {
    set({ isLoading: true, error: null })
    try {
      // Use local API proxy to avoid CORS and auth issues
      const url = `/api/medications/patient/${patientUuid}`
      console.log("[MedicationStore] fetchPatientMedications - URL:", url)

      const response = await axios.get(url, {
        withCredentials: true,
      })

      console.log("[MedicationStore] fetchPatientMedications - Response status:", response.status)
      console.log("[MedicationStore] fetchPatientMedications - Response data:", response.data)

      let medicationsData = []

      if (response.data?.status === "success" && response.data?.data && Array.isArray(response.data.data)) {
        console.log("[MedicationStore] fetchPatientMedications - Success with status.data:", response.data.data)
        medicationsData = response.data.data
      } else if (response.data?.success && response.data?.data && Array.isArray(response.data.data)) {
        console.log("[MedicationStore] fetchPatientMedications - Success with success.data:", response.data.data)
        medicationsData = response.data.data
      } else if (Array.isArray(response.data)) {
        console.log("[MedicationStore] fetchPatientMedications - Success with array:", response.data)
        medicationsData = response.data
      } else if (Array.isArray(response.data?.data)) {
        console.log("[MedicationStore] fetchPatientMedications - Success with data array:", response.data.data)
        medicationsData = response.data.data
      } else {
        console.warn("[MedicationStore] fetchPatientMedications - Unexpected response format:", response.data)
        set({ medications: [], isLoading: false })
        return
      }

      // Transform medication objects if needed
      const transformedMedications: Medication[] = medicationsData.map((med: any) => ({
        id: med.id || med.medicationId,
        pharmacyId: med.pharmacyId || "",
        patientUuid: med.patientUuid || med.patientId || "",
        medicationName: med.medicationName || "",
        genericName: med.genericName || "",
        drugCode: med.drugCode || "",
        dosage: med.dosage || "",
        route: med.route || "oral",
        frequency: med.frequency || "",
        indication: med.indication || "",
        startDate: med.startDate || "",
        endDate: med.endDate || "",
        status: med.status || "active",
        prescribedBy: med.prescribedBy || "",
        verifiedByPharmacist: med.verifiedByPharmacist || false,
        notes: med.notes || "",
        createdAt: med.createdAt,
        updatedAt: med.updatedAt,
      }))

      console.log("[MedicationStore] fetchPatientMedications - Transformed medications:", transformedMedications)
      set({ medications: transformedMedications, isLoading: false })
    } catch (error: any) {
      console.error("[MedicationStore] fetchPatientMedications - Error:", error)
      console.error("[MedicationStore] fetchPatientMedications - Error response:", error.response)
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch medications"
      set({ error: errorMessage, isLoading: false })
    }
  },

  addMedication: async (medicationData: Omit<Medication, "id" | "createdAt" | "updatedAt">) => {
    set({ isLoading: true, error: null })
    try {
      const pharmacyId = getPharmacyId()
      if (!pharmacyId) {
        set({ error: "Pharmacy ID not found. Please log in again.", isLoading: false })
        return { success: false, error: "Pharmacy ID not found" }
      }

      console.log("[MedicationStore] addMedication - Payload:", { ...medicationData, pharmacyId })

      const payload = {
        ...medicationData,
        pharmacyId,
      }

      // Use local API proxy
      const response = await axios.post('/api/medications', payload, {
        withCredentials: true,
      })

      console.log("[MedicationStore] addMedication - Response status:", response.status)
      console.log("[MedicationStore] addMedication - Response data:", response.data)

      if (response.data?.status === "success" || response.data?.success || response.status === 201 || response.status === 200) {
        // Refresh medications for the patient
        await get().fetchPatientMedications(medicationData.patientUuid)
        set({ isLoading: false })
        return { success: true }
      } else {
        const errorMessage = response.data?.message || "Failed to add medication"
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      console.error("[MedicationStore] addMedication - Error:", error)
      console.error("[MedicationStore] addMedication - Error response:", error.response)
      const errorMessage = error.response?.data?.message || error.message || "Failed to add medication"
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  deleteMedication: async (medicationId: string, patientUuid: string) => {
    set({ isLoading: true, error: null })
    try {
      // Use local API proxy
      const url = `/api/medications/${medicationId}`
      console.log("[MedicationStore] deleteMedication - URL:", url)

      const response = await axios.delete(url, {
        withCredentials: true,
      })

      console.log("[MedicationStore] deleteMedication - Response status:", response.status)
      console.log("[MedicationStore] deleteMedication - Response data:", response.data)

      if (response.data?.status === "success" || response.data?.success || response.status === 200 || response.status === 204) {
        // Refresh medications for the patient
        await get().fetchPatientMedications(patientUuid)
        set({ isLoading: false })
        return { success: true }
      } else {
        const errorMessage = response.data?.message || "Failed to delete medication"
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      console.error("[MedicationStore] deleteMedication - Error:", error)
      console.error("[MedicationStore] deleteMedication - Error response:", error.response)
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete medication"
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  clearError: () => set({ error: null }),
}))

