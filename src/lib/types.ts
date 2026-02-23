export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "pharmacist" | "hospitalAdmin";
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  brand: string;
  category: string;
  images: string[];
  inStock: boolean;
  normalRange: string;
  imageUrl?: string;
  stockQuantity: number;
  unit?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  createdAt: string;
  deliveredAt?: string;
  paymentMethod: "mobile-money" | "card";
  paymentType: "full" | "half" | "credit";
  paymentDetails: {
    network?: string;
    accountNumber?: string;
    accountName?: string;
    cardLast4?: string;
  };
  shippingAddress: {
    pharmacyName: string;
    phone: string;
    email: string;
    location: string;
    streetAddress: string;
    gpsAddress?: string;
  };
  tracking: Array<{
    status: string;
    date: string;
  }>;
}

export type PaymentStatus = "delivered" | "processing" | "shipped";
export type PaymentType = "Full Payment" | "Credit" | "Partial";

export interface Payment {
  id: string;
  orderNo: string;
  productName: string;
  paymentType: PaymentType;
  amount: number;
  lastPaymentDate: string;
  amountPaid: number;
  amountRemaining: number;
  status: PaymentStatus;
  date: string;
}
