export interface PaymentMetadata {
  orderId: string
  paymentType: 'full-payment' | 'partial-payment' | 'deposit' | 'installment-payment'
  paymentMethod: 'pay-on-delivery' | 'online-payment' | 'mobile-money' | 'cash-on-delivery' | 'pay-online'
  paymentOption?: string // card, mobile_money, etc.
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
  // Installment fields
  installmentPercentage?: number
  remainingBalance?: number
  // Card specific fields
  cardType?: string
  last4Digits?: string
  cardholderName?: string
  // Mobile money specific fields
  network?: string
  phoneNumber?: string
  // Order details (added when order is created)
  orderDetails?: {
    orderId: string
    orderNumber: string
    total: number
    items: any[]
  }
}

export interface Payment {
  id: string
  userId: string
  transactionId: string
  amount: number
  currency: string
  paymentType: string
  paymentMethod: {
    type: 'mobile_money' | 'card' | 'cash'
    network?: 'mtn' | 'vodafone' | 'telecel' | 'airtel'
    phoneNumber?: string
    accountName?: string
    networkDisplayName?: string
    cardNumber?: string
    cardType?: string
    bankName?: string
    accountNumber?: string
  }
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded"
  description: string
  createdAt: string
  updatedAt: string
  metadata?: PaymentMetadata
}
