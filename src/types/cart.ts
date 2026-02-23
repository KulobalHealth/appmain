import type { Product } from "@/lib/products"

export interface CartItem {
  name: any
  price: any
  id: string
  cartId?: string
  product: Product
  quantity: number
  addedAt: Date
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
  error: string | null
  addItem: (product: Product, quantity?: number) => Promise<{ success: boolean; error?: string }>
  removeItem: (productId: string) => Promise<{ success: boolean; error?: string }>
  updateQuantity: (productId: string, quantity: number) => Promise<{ success: boolean; error?: string }>
  clearCart: () => Promise<{ success: boolean; error?: string }>
  getItemQuantity: (productId: string) => number
  fetchCartItems: () => Promise<{ success: boolean; error?: string }>
  clearError: () => void
}
