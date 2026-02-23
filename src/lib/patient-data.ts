export interface Patient {
  id: number
  name: string
  dob: string
  gender: string
  contact: string
  condition: string
  lastVisit: string
  avatar?: string
  email?: string
  address?: string
}

export const patientsData: Patient[] = []
