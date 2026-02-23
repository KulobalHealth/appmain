import { create } from "zustand"
import axios from "axios"
import type { Product } from "@/lib/products"


// Helper function to transform API product data to our Product interface
const transformApiProduct = (apiProduct: any): Product => {
  return {
    id: apiProduct.productId,
    name: apiProduct.productName,
    brand: apiProduct.brand,
    price: apiProduct.price,
    description: apiProduct.description,
    images: apiProduct.photos || [],
    category: apiProduct.productType,
    stockQuantity: 0, // Not used - products have no quantity limit
    unit: apiProduct.unit || "pieces",
    inStock: true, // Always in stock - no quantity limits
  }
}

interface MarketplaceState {
  products: Product[]
  cart: Record<string, number>
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchAllProducts: () => Promise<void>
  fetchProductsByType: (productTypeCode: string) => Promise<void>
  fetchProductById: (productId: string) => Promise<Product | null>
  
  // Cart actions
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  clearCart: () => void
  
  // Utility
  clearError: () => void
}

export const useMarketplaceStore = create<MarketplaceState>()(
  (set, get) => ({
    products: [], // Start with empty array
    cart: {},
    isLoading: false,
    error: null,

      fetchAllProducts: async () => {
        // Use local API proxy to forward cookies properly
        const fullUrl = '/api/products'
        set({ isLoading: true, error: null })
        try {
          const response = await axios.get(fullUrl, { 
            withCredentials: true,
          })
          const { data } = response

          if (data.status === 'success' && data.data) {
            const transformedProducts = data.data.map(transformApiProduct)
            set({ products: transformedProducts, isLoading: false })
          } else {
            set({ error: data.message || "Failed to fetch products", isLoading: false })
          }
        } catch (error: any) {
          const status = error?.response?.status
          const responseMessage = (error?.response?.data?.message || "").toLowerCase()
          
          // Only log in development
          if (process.env.NODE_ENV === 'development') {
            console.log("Products API:", status || "Network error", "-", error?.message)
          }
          
          let errorMessage = "Failed to fetch products"
          
          // Check for authentication-related messages or status codes
          if (
            responseMessage.includes("authentication") || 
            responseMessage.includes("unauthorized") || 
            responseMessage.includes("log in") ||
            status === 401 || 
            status === 403 || 
            status === 404
          ) {
            errorMessage = "Please log in to access the marketplace"
          }
          // Handle network/CORS errors (no response)
          else if (!error?.response) {
            if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
              errorMessage = "Network error. Please check your connection."
            } else {
              // Likely a CORS or authentication issue
              errorMessage = "Please log in to access the marketplace"
            }
          } else {
            errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch products"
          }
          
          set({ error: errorMessage, isLoading: false })
        }
      },

      fetchProductsByType: async (productTypeCode: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'
        set({ isLoading: true, error: null })
        try {
          const response = await axios.get(`${apiUrl}/products/type?productTypeCode=${productTypeCode}`, { withCredentials: true })
          const { data } = response

          if (data.status === 'success' && data.data) {
            const transformedProducts = data.data.map(transformApiProduct)
            set({ products: transformedProducts, isLoading: false })
          } else {
            set({ error: data.message || "Failed to fetch products", isLoading: false })
          }
        } catch (error: any) {
          const status = error.response?.status
          let errorMessage = error.response?.data?.message || error.message || "Failed to fetch products"
          
          if (status === 401 || status === 403 || status === 404) {
            errorMessage = "Please log in to view products"
          }
          
          set({ error: errorMessage, isLoading: false })
        }
      },

      fetchProductById: async (productId: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'
        set({ isLoading: true, error: null })
        try {
          const url = `${apiUrl}/products/${productId}`
          const response = await axios.get(url, { withCredentials: true })
          const { data } = response

          if (data.status === 'success' && data.data) {
            const transformedProduct = transformApiProduct(data.data)
            set({ isLoading: false })
            return transformedProduct
          } else {
            set({ error: data.message || "Product not found", isLoading: false })
            return null
          }
        } catch (error: any) {
          const status = error.response?.status
          let errorMessage = "Failed to fetch product"
          
          if (status === 404) {
            errorMessage = error.response?.data?.message || "Product not found"
          } else if (status === 401 || status === 403) {
            errorMessage = "Please log in to view product details"
          } else {
            errorMessage = error.response?.data?.message || error.message || "Failed to fetch product"
          }
          
          set({ error: errorMessage, isLoading: false })
          return null
        }
      },

      addToCart: (productId) =>
        set((state) => {
          const product = state.products.find((p) => p.id === productId)
          if (!product) return state

          return {
            cart: {
              ...state.cart,
              [productId]: (state.cart[productId] || 0) + 1,
            },
          }
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const newCart = { ...state.cart }
          delete newCart[productId]
          return { cart: newCart }
        }),

      increaseQuantity: (productId) =>
        set((state) => ({
          cart: {
            ...state.cart,
            [productId]: (state.cart[productId] || 0) + 1,
          },
        })),

      decreaseQuantity: (productId) =>
        set((state) => {
          const currentQuantity = state.cart[productId] || 0
          if (currentQuantity <= 1) {
            const newCart = { ...state.cart }
            delete newCart[productId]
            return { cart: newCart }
          }
          return {
            cart: {
              ...state.cart,
              [productId]: currentQuantity - 1,
            },
          }
        }),

      clearCart: () => {
        set({ cart: {} })
      },

    clearError: () => {
      set({ error: null })
    },
  })
)
