
export interface Pharmacy {
  id: string
  pharmacyId: string
  pharmacy: string
  location: string
  licenceNumber?: string
  branch?: number
  region?: string
  city?: string
  gps?: string
  pharmacyBio?: string
  photo?: string
  dateCreated?: string
}

export interface CurrentSubscription {
  packageId: string
  startDate: string
  endDate: string
  active: boolean
  durationMonths: number
  amountPaid: number
  paymentDate?: string
}

export interface User {
  id: string
  pharmacy?: string | Pharmacy // Support both string and object for backwards compatibility
  firstName: string
  lastName: string
  location: string
  email: string
  phoneNumber: string
  createdAt?: string
  // Optional fields from API
  staffId?: string
  active?: boolean
  verifiedUser?: boolean
  role?: string
  userType?: string
  pharmacyId?: string
  photo?: string
  licenceNumber?: string
  branch?: number
  pharmacyBio?: string
  token?: string
  dateCreated?: string
  businessName?: string // For pharmacy role
  ownerName?: string // For pharmacy role
  avatar?: string
  // Subscription info
  currentSubscription?: CurrentSubscription | null
}

export interface RegisterData {
  pharmacy: string
  firstName: string
  lastName: string
  location: string
  email: string
  phoneNumber: string
  password: string
}
