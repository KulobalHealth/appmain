export interface Prescription {
  id: number
  patientName: string
  medication: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  status: "Active" | "Completed" | "Ongoing"
}

export const prescriptionData: Prescription[] = []

// Helper functions for data manipulation
export const getActivePrescrptions = () => {
  return prescriptionData.filter((prescription) => prescription.status === "Active")
}

export const getCompletedPrescriptions = () => {
  return prescriptionData.filter((prescription) => prescription.status === "Completed")
}

export const getOngoingPrescriptions = () => {
  return prescriptionData.filter((prescription) => prescription.status === "Ongoing")
}

export const getPrescriptionById = (id: number) => {
  return prescriptionData.find((prescription) => prescription.id === id)
}

export const searchPrescriptions = (searchTerm: string) => {
  const term = searchTerm.toLowerCase()
  return prescriptionData.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(term) ||
      prescription.medication.toLowerCase().includes(term) ||
      prescription.dosage.toLowerCase().includes(term) ||
      prescription.frequency.toLowerCase().includes(term),
  )
}
