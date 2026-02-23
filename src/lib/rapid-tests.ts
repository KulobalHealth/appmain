export interface RapidTest {
  id: number
  name: string
  testType: string
  results: string
  status: string
  date: string
  conductedBy: string
  patientId?: number
  notes?: string
  priority?: string
}

export const rapidTestsData: RapidTest[] = []
