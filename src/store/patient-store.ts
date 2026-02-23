import { create } from "zustand"
import axios from "axios"
import { useAuthStore } from "./auth-store"

export interface Patient {
  id?: string
  pharmacyId: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender?: "male" | "female" | "other" | string
  patientType: "chronic" | "normal"
  location: string
  telephone: string
  email?: string | null
}

interface PatientState {
  patients: Patient[]
  selectedPatient: Patient | null
  isLoading: boolean
  error: string | null
}

interface PatientActions {
  fetchPatients: () => Promise<void>
  fetchPatientById: (id: string) => Promise<Patient | null>
  addPatient: (patientData: Omit<Patient, "id">) => Promise<{ success: boolean; error?: string }>
  updatePatient: (id: string, patientData: Partial<Omit<Patient, "id" | "pharmacyId">>) => Promise<{ success: boolean; error?: string }>
  deletePatient: (id: string) => Promise<{ success: boolean; error?: string }>
  selectPatient: (patient: Patient | null) => void
  clearError: () => void
}

type PatientStore = PatientState & PatientActions

const getPharmacyId = (): string | null => {
  const user = useAuthStore.getState().user
  console.log("[PatientStore] getPharmacyId - User:", user)
  
  if (!user) {
    console.log("[PatientStore] getPharmacyId - No user found")
    return null
  }

  // Try different ways to get pharmacyId
  if (user.pharmacyId) {
    console.log("[PatientStore] getPharmacyId - Found pharmacyId:", user.pharmacyId)
    return user.pharmacyId
  }
  
  if (typeof user.pharmacy === "object" && user.pharmacy?.pharmacyId) {
    console.log("[PatientStore] getPharmacyId - Found pharmacy.pharmacyId:", user.pharmacy.pharmacyId)
    return user.pharmacy.pharmacyId
  }
  
  if (typeof user.pharmacy === "string") {
    console.log("[PatientStore] getPharmacyId - Found pharmacy (string):", user.pharmacy)
    return user.pharmacy
  }

  console.log("[PatientStore] getPharmacyId - No pharmacyId found in user object")
  return null
}

const getPharmacyUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_PHARMACY_URL ?? "http://localhost:4000"
  const url = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
  console.log("[PatientStore] getPharmacyUrl - Base URL:", url)
  console.log("[PatientStore] getPharmacyUrl - NEXT_PUBLIC_PHARMACY_URL:", process.env.NEXT_PUBLIC_PHARMACY_URL)
  return url
}

export const usePatientStore = create<PatientStore>()((set, get) => ({
  patients: [],
  selectedPatient: null,
  isLoading: false,
  error: null,

  fetchPatients: async () => {
    set({ isLoading: true, error: null })
    try {
      const pharmacyId = getPharmacyId()
      if (!pharmacyId) {
        console.log("[PatientStore] fetchPatients - No pharmacyId, skipping")
        set({ isLoading: false })
        return
      }
      
      // Use local proxy to handle auth cookies properly
      const url = `/api/patients?pharmacyId=${pharmacyId}`
      console.log("[PatientStore] fetchPatients - URL:", url)
      
      const response = await axios.get(url, {
        withCredentials: true,
      })

      console.log("[PatientStore] fetchPatients - Response status:", response.status)
      console.log("[PatientStore] fetchPatients - Response data:", response.data)

      let patientsData = []
      
      if (response.data?.status === "success" && response.data?.data && Array.isArray(response.data.data)) {
        console.log("[PatientStore] fetchPatients - Success with data.data:", response.data.data)
        patientsData = response.data.data
      } else if (response.data?.success && response.data?.data && Array.isArray(response.data.data)) {
        console.log("[PatientStore] fetchPatients - Success with success.data:", response.data.data)
        patientsData = response.data.data
      } else if (Array.isArray(response.data)) {
        console.log("[PatientStore] fetchPatients - Success with array:", response.data)
        patientsData = response.data
      } else if (Array.isArray(response.data?.data)) {
        console.log("[PatientStore] fetchPatients - Success with data array:", response.data.data)
        patientsData = response.data.data
      } else {
        console.warn("[PatientStore] fetchPatients - Unexpected response format:", response.data)
        set({ patients: [], isLoading: false })
        return
      }

      // Transform patient objects: patientId -> id
      const transformedPatients = patientsData.map((patient: any) => ({
        id: patient.patientId || patient.id,
        pharmacyId: patient.pharmacyId || "",
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender || null,
        patientType: patient.patientType,
        location: patient.location,
        telephone: patient.telephone,
        email: patient.email || null,
      }))

      console.log("[PatientStore] fetchPatients - Transformed patients:", transformedPatients)
      console.log("[PatientStore] fetchPatients - Setting patients in store, count:", transformedPatients.length)
      set({ patients: transformedPatients, isLoading: false })
      
      // Verify the patients were set
      setTimeout(() => {
        const currentPatients = get().patients
        console.log("[PatientStore] fetchPatients - Patients after set, count:", currentPatients.length)
        console.log("[PatientStore] fetchPatients - Patients after set:", currentPatients)
      }, 100)
    } catch (error: any) {
      console.error("[PatientStore] fetchPatients - Error:", error)
      console.error("[PatientStore] fetchPatients - Error response:", error.response)
      console.error("[PatientStore] fetchPatients - Error message:", error.message)
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch patients"
      set({ error: errorMessage, isLoading: false })
    }
  },

  fetchPatientById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      // Use local API proxy to properly forward cookies
      const url = `/api/patients/${id}`
      console.log("[PatientStore] fetchPatientById - URL:", url)
      
      const response = await axios.get(url, {
        withCredentials: true,
      })

      console.log("[PatientStore] fetchPatientById - Response status:", response.status)
      console.log("[PatientStore] fetchPatientById - Response data:", response.data)

      let patientData = null
      
      // Handle different response formats
      // For single patient, the structure might be:
      // { status: "success", data: { patientId: "...", ... } }
      // or { success: true, data: { patientId: "...", ... } }
      // or directly { patientId: "...", ... }
      if (response.data?.status === "success" && response.data?.data) {
        console.log("[PatientStore] fetchPatientById - Success with status.data:", response.data.data)
        patientData = response.data.data
      } else if (response.data?.success && response.data?.data) {
        console.log("[PatientStore] fetchPatientById - Success with success.data:", response.data.data)
        patientData = response.data.data
      } else if (response.data?.data && typeof response.data.data === "object" && !Array.isArray(response.data.data)) {
        // Single patient object in data.data
        console.log("[PatientStore] fetchPatientById - Single patient in data.data:", response.data.data)
        patientData = response.data.data
      } else if (response.data && typeof response.data === "object" && !Array.isArray(response.data) && response.data.patientId) {
        // Direct patient object in response.data
        console.log("[PatientStore] fetchPatientById - Direct patient object in response.data:", response.data)
        patientData = response.data
      } else {
        console.warn("[PatientStore] fetchPatientById - Unexpected response format:", response.data)
      }

      if (!patientData || !patientData.patientId && !patientData.id) {
        console.warn("[PatientStore] fetchPatientById - No valid patient data found in response")
        set({ isLoading: false })
        return null
      }

      // Transform patient object: patientId -> id (same as fetchPatients)
      const transformedPatient: Patient = {
        id: patientData.patientId || patientData.id,
        pharmacyId: patientData.pharmacyId || "",
        firstName: patientData.firstName || "",
        lastName: patientData.lastName || "",
        dateOfBirth: patientData.dateOfBirth || "",
        patientType: patientData.patientType || "normal",
        location: patientData.location || "",
        telephone: patientData.telephone || "",
        email: patientData.email || null,
      }

      console.log("[PatientStore] fetchPatientById - Transformed patient:", transformedPatient)
      set({ selectedPatient: transformedPatient, isLoading: false })
      return transformedPatient
    } catch (error: any) {
      console.error("[PatientStore] fetchPatientById - Error:", error)
      console.error("[PatientStore] fetchPatientById - Error response:", error.response)
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch patient"
      set({ error: errorMessage, isLoading: false })
      return null
    }
  },

  addPatient: async (patientData: Omit<Patient, "id">) => {
    set({ isLoading: true, error: null })
    try {
      const pharmacyId = getPharmacyId()
      if (!pharmacyId) {
        set({ error: "Pharmacy ID not found. Please log in again.", isLoading: false })
        return { success: false, error: "Pharmacy ID not found. Please log in again." }
      }

      const baseUrl = getPharmacyUrl()
      const payload = {
        ...patientData,
        pharmacyId,
        email: patientData.email || null,
      }

      const response = await axios.post(`${baseUrl}/patient`, payload, {
        withCredentials: true,
      })

      if (response.data?.success || response.status === 200 || response.status === 201) {
        const newPatient = response.data?.data || response.data
        set((state) => ({
          patients: [...state.patients, newPatient],
          isLoading: false,
        }))
        return { success: true }
      } else {
        const errorMessage = response.data?.message || "Failed to add patient"
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to add patient"
      set({ error: errorMessage, isLoading: false })
      console.error("Error adding patient:", error)
      return { success: false, error: errorMessage }
    }
  },

  updatePatient: async (id: string, patientData: Partial<Omit<Patient, "id" | "pharmacyId">>) => {
    set({ isLoading: true, error: null })
    try {
      const baseUrl = getPharmacyUrl()
      const payload = {
        ...patientData,
        email: patientData.email || null,
      }

      const response = await axios.patch(`${baseUrl}/patient/${id}`, payload, {
        withCredentials: true,
      })

      if (response.data?.success || response.status === 200) {
        const updatedPatient = response.data?.data || response.data
        set((state) => ({
          patients: state.patients.map((p) => (p.id === id ? { ...p, ...updatedPatient } : p)),
          selectedPatient: state.selectedPatient?.id === id ? { ...state.selectedPatient, ...updatedPatient } : state.selectedPatient,
          isLoading: false,
        }))
        return { success: true }
      } else {
        const errorMessage = response.data?.message || "Failed to update patient"
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update patient"
      set({ error: errorMessage, isLoading: false })
      console.error("Error updating patient:", error)
      return { success: false, error: errorMessage }
    }
  },

  deletePatient: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const baseUrl = getPharmacyUrl()
      const response = await axios.delete(`${baseUrl}/patient/${id}`, {
        withCredentials: true,
      })

      if (response.data?.success || response.status === 200 || response.status === 204) {
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
          selectedPatient: state.selectedPatient?.id === id ? null : state.selectedPatient,
          isLoading: false,
        }))
        return { success: true }
      } else {
        const errorMessage = response.data?.message || "Failed to delete patient"
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete patient"
      set({ error: errorMessage, isLoading: false })
      console.error("Error deleting patient:", error)
      return { success: false, error: errorMessage }
    }
  },

  selectPatient: (patient: Patient | null) => {
    set({ selectedPatient: patient })
  },

  clearError: () => {
    set({ error: null })
  },
}))

