import { create } from "zustand"
import axios from "axios"
import type { CartState, CartItem } from "@/types/cart"
import type { Product } from "@/lib/products"
import { useAuthStore } from "@/store/auth-store"

// Use local API proxy for all cart operations to handle auth cookies properly
const buildCartUrl = (suffix: string): string => {
  // All cart operations go through our proxy at /api/cart
  // The proxy will forward to the actual backend with proper auth
  return '/api/cart'
}

export const useCartStore = create<CartState>()(
  (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,
      error: null,

      addItem: async (product: Product, quantity = 1) => {
                // Check if user is authenticated FIRST - before any state changes
                const isAuthenticated = useAuthStore.getState().isAuthenticated
                if (!isAuthenticated) {
                  console.log("Cart - Blocked: User not authenticated")
                  return { success: false, error: "LOGIN_REQUIRED" }
                }

        set({ isLoading: true, error: null })
        
        console.log("Cart - Adding item:", { product, quantity })
        
        // Optimistically update state first
        const currentItems = get().items
        console.log("Cart - Current items before add:", currentItems)
        
        const existingItem = currentItems.find(item => item.id === product.id)
        
        let updatedItems: CartItem[]
        if (existingItem) {
          updatedItems = currentItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            product: product,
            quantity: quantity,
            addedAt: new Date()
          }
          updatedItems = [...currentItems, newItem]
        }
        
        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        
        console.log("Cart - Updated items after add:", updatedItems)
        console.log("Cart - Total items:", newTotalItems, "Total price:", newTotalPrice)
        
        // Update state immediately
        set({
          items: updatedItems,
          totalItems: newTotalItems,
          totalPrice: newTotalPrice
        })
        
        try {
          // Get pharmacyId from auth store
          const user = useAuthStore.getState().user
          console.log("AddItem - Full User Object:", user)
          console.log("AddItem - user?.pharmacyId:", user?.pharmacyId)
          console.log("AddItem - user?.pharmacy:", user?.pharmacy)
          console.log("AddItem - typeof user?.pharmacy:", typeof user?.pharmacy)
          
          let pharmacyId: string | undefined
          
          if (user?.pharmacyId) {
            pharmacyId = user.pharmacyId
            console.log("AddItem - Using user.pharmacyId:", pharmacyId)
          } else if (typeof user?.pharmacy === 'object' && user.pharmacy?.pharmacyId) {
            pharmacyId = user.pharmacy.pharmacyId
            console.log("AddItem - Using user.pharmacy.pharmacyId:", pharmacyId)
          } else if (typeof user?.pharmacy === 'string') {
            pharmacyId = user.pharmacy
            console.log("AddItem - Using user.pharmacy (string):", pharmacyId)
          } else {
            console.log("AddItem - No pharmacyId found in user object")
          }
          
          console.log("AddItem - Final Extracted pharmacyId:", pharmacyId)
          
          if (!pharmacyId) {
            console.error("AddItem - Pharmacy ID not found")
            set({ error: "Pharmacy ID not found. Please log in again.", isLoading: false })
            return { success: false, error: "Pharmacy ID not found. Please log in again." }
          }

          // Sync with DB - payload should only include productName, productId, and pharmacyId
          const payload = {
            productId: product.id,
            productName: product.name,
            pharmacyId: pharmacyId
          }

          console.log("AddItem - Adding item to cart with payload:", payload)
          console.log("AddItem - API URL:", buildCartUrl("/cart/add"))

          const response = await axios.post(buildCartUrl("/cart/add"), payload, {
            withCredentials: true
          })

          console.log("AddItem - Response Status:", response.status)
          console.log("AddItem - Response Data:", response.data)
          console.log("AddItem - Full Response:", response)

          const { data } = response
          if (data.status === 'success') {
            console.log("AddItem - Success! Fetching updated cart...")
            // Sync with DB after successful add
            const fetchResult = await get().fetchCartItems()
            console.log("AddItem - Cart fetch result after add:", fetchResult)
            set({ isLoading: false })
            return { success: true }
          } else {
            console.warn("AddItem - API returned non-success status:", data)
            // Revert on failure
            set({
              items: currentItems,
              totalItems: currentItems.reduce((sum, item) => sum + item.quantity, 0),
              totalPrice: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
              error: data.message || "Failed to add item to cart",
              isLoading: false
            })
            return { success: false, error: data.message || "Failed to add item to cart" }
          }
        } catch (error: any) {
          console.error("Error adding item to cart:", error)
          console.error("Error response:", error.response?.data)
          // Revert on error
          set({
            items: currentItems,
            totalItems: currentItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            error: error.response?.data?.message || error.message || "Failed to add item to cart",
            isLoading: false
          })
          return { success: false, error: error.response?.data?.message || error.message || "Failed to add item to cart" }
        }
      },

      removeItem: async (productId: string) => {
        set({ isLoading: true, error: null })
        
        console.log("Cart - Removing item:", productId)
        
        // Get the cart item to find cartId
        const currentItems = get().items
        const itemToRemove = currentItems.find(item => item.id === productId)
        
        if (!itemToRemove) {
          console.error("Cart - Item not found:", productId)
          set({ isLoading: false, error: "Item not found in cart" })
          return { success: false, error: "Item not found in cart" }
        }
        
        // Check if cartId exists (required by backend)
        if (!itemToRemove.cartId) {
          console.error("Cart - cartId is required but not found for item:", productId)
          // Try to fetch fresh cart items to get cartId
          await get().fetchCartItems()
          const refreshedItems = get().items
          const refreshedItem = refreshedItems.find(item => item.id === productId)
          
          if (!refreshedItem || !refreshedItem.cartId) {
            set({ isLoading: false, error: "Cart ID is required. Please refresh and try again." })
            return { success: false, error: "Cart ID is required. Please refresh and try again." }
          }
          
          // Use refreshed item's cartId
          itemToRemove.cartId = refreshedItem.cartId
        }
        
        console.log("Cart - Current items before remove:", currentItems)
        console.log("Cart - Using cartId:", itemToRemove.cartId)
        
        const updatedItems = currentItems.filter(item => item.id !== productId)
        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        
        console.log("Cart - Updated items after remove:", updatedItems)
        console.log("Cart - Total items:", newTotalItems, "Total price:", newTotalPrice)
        
        // Update state immediately
        set({
          items: updatedItems,
          totalItems: newTotalItems,
          totalPrice: newTotalPrice
        })
        
        try {
          // Sync with DB - delete single item using cartId
          const response = await axios.delete(buildCartUrl("/cart/delete"), {
            data: {
              cartId: itemToRemove.cartId,
              productId: productId
            },
            withCredentials: true
          })

          const { data } = response
          if (data.status === 'success') {
            // Sync with DB after successful removal
            await get().fetchCartItems()
            set({ isLoading: false })
            return { success: true }
          } else {
            // Revert on failure
            set({
              items: currentItems,
              totalItems: currentItems.reduce((sum, item) => sum + item.quantity, 0),
              totalPrice: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
              error: data.message || "Failed to remove item from cart",
              isLoading: false
            })
            return { success: false, error: data.message || "Failed to remove item from cart" }
          }
        } catch (error: any) {
          // Revert on error
          set({
            items: currentItems,
            totalItems: currentItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            error: error.response?.data?.message || error.message || "Failed to remove item from cart",
            isLoading: false
          })
          return { success: false, error: error.response?.data?.message || error.message || "Failed to remove item from cart" }
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity <= 0) {
          return await get().removeItem(productId)
        }

        set({ isLoading: true, error: null })
        
        console.log("Cart - Updating quantity:", { productId, quantity })
        
        // Keep current items for potential rollback
        const currentItems = get().items
        console.log("Cart - Current items before update:", currentItems)
        
        try {
          // Get pharmacyId from auth store
          const user = useAuthStore.getState().user
          console.log("UpdateQuantity - Full User Object:", user)
          console.log("UpdateQuantity - user?.pharmacyId:", user?.pharmacyId)
          console.log("UpdateQuantity - user?.pharmacy:", user?.pharmacy)
          console.log("UpdateQuantity - typeof user?.pharmacy:", typeof user?.pharmacy)
          
          let pharmacyId: string | undefined
          
          if (user?.pharmacyId) {
            pharmacyId = user.pharmacyId
            console.log("UpdateQuantity - Using user.pharmacyId:", pharmacyId)
          } else if (typeof user?.pharmacy === 'object' && user.pharmacy?.pharmacyId) {
            pharmacyId = user.pharmacy.pharmacyId
            console.log("UpdateQuantity - Using user.pharmacy.pharmacyId:", pharmacyId)
          } else if (typeof user?.pharmacy === 'string') {
            pharmacyId = user.pharmacy
            console.log("UpdateQuantity - Using user.pharmacy (string):", pharmacyId)
          } else {
            console.log("UpdateQuantity - No pharmacyId found in user object")
          }
          
          console.log("UpdateQuantity - Final Extracted pharmacyId:", pharmacyId)
          console.log("UpdateQuantity - ProductId:", productId, "New Quantity:", quantity)
          
          if (!pharmacyId) {
            console.error("UpdateQuantity - Pharmacy ID not found in user object:", user)
            set({ error: "Pharmacy ID not found. Please log in again.", isLoading: false })
            return { success: false, error: "Pharmacy ID not found. Please log in again." }
          }

          // Determine if we're increasing or decreasing
          const currentItem = currentItems.find(item => item.id === productId)
          const currentQuantity = currentItem ? currentItem.quantity : 0
          const cartId = currentItem?.cartId
          
          console.log("UpdateQuantity - Current quantity:", currentQuantity, "Target quantity:", quantity)
          console.log("UpdateQuantity - CartId:", cartId)
          
          if (!cartId) {
            console.error("UpdateQuantity - CartId not found for product:", productId)
            set({ error: "Cart ID not found. Please refresh and try again.", isLoading: false })
            return { success: false, error: "Cart ID not found. Please refresh and try again." }
          }
          
          // Calculate the difference
          const diff = quantity - currentQuantity
          
          if (diff === 0) {
            // No change needed
            console.log("UpdateQuantity - No change needed")
            set({ isLoading: false })
            return { success: true }
          }
          
          let response
          
          // The API increments/decrements by the quantity value we send
          // So we need to send the difference, not the target quantity
          const quantityToSend = Math.abs(diff)
          
          if (diff > 0) {
            // Increase quantity - use PATCH method
            // Send the increment amount (difference)
            console.log(`Increasing quantity by: ${quantityToSend} (from ${currentQuantity} to ${quantity})`, { cartId, productId, quantity: quantityToSend })
            try {
              response = await axios.patch(buildCartUrl("/cart/increase-quanity"), {
                cartId: cartId,
                productId: productId,
                quantity: quantityToSend
              }, {
                withCredentials: true
              })
              console.log("Increase response:", response.data)
            } catch (err: any) {
              console.error("Increase API error:", err)
              console.error("Error response:", err.response?.data)
              // Revert on error
              set({
                items: currentItems,
                totalItems: currentItems.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                error: err.response?.data?.message || err.message || "Failed to update quantity",
                isLoading: false
              })
              return { success: false, error: err.response?.data?.message || err.message || "Failed to update quantity" }
            }
          } else {
            // Decrease quantity - use PATCH method
            // Send the decrement amount (absolute difference)
            console.log(`Decreasing quantity by: ${quantityToSend} (from ${currentQuantity} to ${quantity})`, { cartId, productId, quantity: quantityToSend })
            try {
              response = await axios.patch(buildCartUrl("/cart/decrease-quanity"), {
                cartId: cartId,
                productId: productId,
                quantity: quantityToSend
              }, {
                withCredentials: true
              })
              console.log("Decrease response:", response.data)
            } catch (err: any) {
              console.error("Decrease API error:", err)
              console.error("Error response:", err.response?.data)
              // Revert on error
              set({
                items: currentItems,
                totalItems: currentItems.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                error: err.response?.data?.message || err.message || "Failed to update quantity",
                isLoading: false
              })
              return { success: false, error: err.response?.data?.message || err.message || "Failed to update quantity" }
            }
          }
          
          if (!response || response.data.status !== 'success') {
            // Revert on failure
            set({
              items: currentItems,
              totalItems: currentItems.reduce((sum, item) => sum + item.quantity, 0),
              totalPrice: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
              error: response?.data?.message || "Failed to update quantity",
              isLoading: false
            })
            return { success: false, error: response?.data?.message || "Failed to update quantity" }
          }

          if (response && response.data.status === 'success') {
            // Sync with DB after successful update
            await get().fetchCartItems()
            set({ isLoading: false })
            return { success: true }
          } else {
            // Revert on failure
            const errorMsg = response?.data?.message || "Failed to update quantity"
            console.error("Reverting cart state due to error:", errorMsg)
            set({
              items: currentItems,
              totalItems: currentItems.reduce((sum, item) => sum + item.quantity, 0),
              totalPrice: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
              error: errorMsg,
              isLoading: false
            })
            return { success: false, error: errorMsg }
          }
        } catch (error: any) {
          // Revert on error
          set({
            items: currentItems,
            totalItems: currentItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            error: error.response?.data?.message || error.message || "Failed to update quantity",
            isLoading: false
          })
          return { success: false, error: error.response?.data?.message || error.message || "Failed to update quantity" }
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null })
        
        console.log("Cart - Clearing cart")
        
        // Save current state for potential revert
        const currentItems = get().items
        const currentTotalItems = get().totalItems
        const currentTotalPrice = get().totalPrice
        
        console.log("Cart - Current state before clear:", { currentItems, currentTotalItems, currentTotalPrice })
        
        // Optimistically clear state first
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0
        })
        
        console.log("Cart - Cart cleared")
        
        try {
          // Get pharmacyId from auth store
          const user = useAuthStore.getState().user
          console.log("ClearCart - Full User Object:", user)
          console.log("ClearCart - user?.pharmacyId:", user?.pharmacyId)
          console.log("ClearCart - user?.pharmacy:", user?.pharmacy)
          console.log("ClearCart - typeof user?.pharmacy:", typeof user?.pharmacy)
          
          let pharmacyId: string | undefined
          
          if (user?.pharmacyId) {
            pharmacyId = user.pharmacyId
            console.log("ClearCart - Using user.pharmacyId:", pharmacyId)
          } else if (typeof user?.pharmacy === 'object' && user.pharmacy?.pharmacyId) {
            pharmacyId = user.pharmacy.pharmacyId
            console.log("ClearCart - Using user.pharmacy.pharmacyId:", pharmacyId)
          } else if (typeof user?.pharmacy === 'string') {
            pharmacyId = user.pharmacy
            console.log("ClearCart - Using user.pharmacy (string):", pharmacyId)
          } else {
            console.log("ClearCart - No pharmacyId found in user object")
          }
          
          console.log("ClearCart - Final Extracted pharmacyId:", pharmacyId)
          
          if (!pharmacyId) {
            console.error("ClearCart - Pharmacy ID not found")
            set({ error: "Pharmacy ID not found. Please log in again.", isLoading: false })
            return { success: false, error: "Pharmacy ID not found. Please log in again." }
          }

          // Sync with DB - use pharmacyId in endpoint
          console.log("ClearCart - Calling API with pharmacyId:", pharmacyId)
          const response = await axios.delete(buildCartUrl(`/cart/empty-cart/${pharmacyId}`), {
            withCredentials: true
          })

          const { data } = response
          if (data.status === 'success') {
            set({ isLoading: false })
            return { success: true }
          } else {
            // Revert on failure
            set({
              items: currentItems,
              totalItems: currentTotalItems,
              totalPrice: currentTotalPrice,
              error: data.message || "Failed to clear cart",
              isLoading: false
            })
            return { success: false, error: data.message || "Failed to clear cart" }
          }
        } catch (error: any) {
          // Revert on error
          set({
            items: currentItems,
            totalItems: currentTotalItems,
            totalPrice: currentTotalPrice,
            error: error.response?.data?.message || error.message || "Failed to clear cart",
            isLoading: false
          })
          return { success: false, error: error.response?.data?.message || error.message || "Failed to clear cart" }
        }
      },

      getItemQuantity: (productId: string) => {
        const item = get().items.find((item) => item.id === productId)
        return item ? item.quantity : 0
      },

      fetchCartItems: async () => {
        // Early bailout if not authenticated
        const isAuthenticated = useAuthStore.getState().isAuthenticated
        if (!isAuthenticated) {
          console.log("Cart - Skipping fetch: User not authenticated")
          set({ isLoading: false })
          return { success: false, error: "Not authenticated" }
        }
        
        set({ isLoading: true, error: null })
        
        console.log("Cart - Fetching cart items")
        
        try {
          // Get pharmacyId from auth store
          const user = useAuthStore.getState().user
          const isAuthenticated = useAuthStore.getState().isAuthenticated
          
          console.log("Cart - Is Authenticated:", isAuthenticated)
          console.log("Cart - Full User Object:", user)
          console.log("Cart - user?.pharmacyId:", user?.pharmacyId)
          console.log("Cart - user?.pharmacy:", user?.pharmacy)
          console.log("Cart - typeof user?.pharmacy:", typeof user?.pharmacy)
          
          let pharmacyId: string | undefined
          
          if (user?.pharmacyId) {
            pharmacyId = user.pharmacyId
            console.log("Cart - Using user.pharmacyId:", pharmacyId)
          } else if (typeof user?.pharmacy === 'object' && user.pharmacy?.pharmacyId) {
            pharmacyId = user.pharmacy.pharmacyId
            console.log("Cart - Using user.pharmacy.pharmacyId:", pharmacyId)
          } else if (typeof user?.pharmacy === 'string') {
            pharmacyId = user.pharmacy
            console.log("Cart - Using user.pharmacy (string):", pharmacyId)
          } else {
            console.log("Cart - No pharmacyId found in user object")
          }
          
          console.log("Cart - Final Extracted pharmacyId:", pharmacyId)
          
          if (!pharmacyId) {
            console.error("Cart - Pharmacy ID not found")
            set({ error: "Pharmacy ID not found. Please log in again.", isLoading: false })
            return { success: false, error: "Pharmacy ID not found. Please log in again." }
          }

          // Try to fetch from DB using pharmacyId via local proxy
          const cartUrl = `/api/cart?pharmacyId=${pharmacyId}`
          console.log("Cart - Fetching from URL:", cartUrl)
          
          const response = await axios.get(cartUrl, {
            withCredentials: true
          })
          
          console.log("Cart - API Response Status:", response.status)
          console.log("Cart - API Response Data:", response.data)

          const { data } = response
          console.log("Cart API response:", data)
          
          if (data.status === 'success' && data.data) {
            // Transform API cart items to our CartItem format
            // Note: API returns cart items with nested products array
            const cartItems: CartItem[] = data.data.map((cartItem: any) => {
              // Get product details from the nested products array
              const product = cartItem.products && cartItem.products.length > 0 ? cartItem.products[0] : null
              
              // Extract price from product or cart item
              const price = product?.price || cartItem.price || cartItem.productPrice || 0
              
              // Extract images from product
              const images = product?.photos || 
                            product?.images || 
                            cartItem.photos || 
                            cartItem.images || 
                            product?.productImage ? [product.productImage] : 
                            []
              
              // Ensure images is always an array
              const imageArray = Array.isArray(images) ? images : (images ? [images] : [])
              
              // Get unit from API only
              const unit = product?.unit || cartItem.unit || 'pieces'
              
              console.log("Mapping cart item:", {
                cartId: cartItem.cartId,
                productId: cartItem.productId,
                productName: product?.productName || cartItem.productName,
                price,
                quantity: cartItem.quantity,
                unit,
                images: imageArray,
                rawItem: cartItem
              })
              
              return {
                id: cartItem.productId,
                cartId: cartItem.cartId,
                name: product?.productName || cartItem.productName || 'Unknown Product',
                price: price,
                product: {
                  id: cartItem.productId,
                  name: product?.productName || cartItem.productName || 'Unknown Product',
                  brand: product?.brand || cartItem.brand || '',
                  price: price,
                  description: product?.description || cartItem.description || '',
                  images: imageArray,
                  category: product?.productType || cartItem.productType || cartItem.category || '',
                  stockQuantity: 0, // Not used - products have no quantity limit
                  unit: unit,
                  inStock: true // Always in stock - no quantity limits
                },
                quantity: cartItem.quantity || 1, // Default to 1 if not provided
                addedAt: new Date(cartItem.addedAt || cartItem.dateAdded || Date.now())
              }
            })

            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
            const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

            console.log("Cart - Fetched cart items:", cartItems)
            console.log("Cart - Total items:", totalItems, "Total price:", totalPrice)

            // Update store with DB data
            set({
              items: cartItems,
              totalItems,
              totalPrice,
              isLoading: false
            })
            return { success: true }
          } else {
            console.warn("Cart - API response not successful:", data)
            set({ error: data.message || "Failed to fetch cart items", isLoading: false })
            return { success: false, error: data.message || "Failed to fetch cart items" }
          }
        } catch (error: any) {
          // Handle 404 gracefully - treat as empty cart (user may not have a cart yet)
          if (error.response?.status === 404) {
            console.log("Cart - No cart found (404), treating as empty cart")
            set({ 
              items: [], 
              totalItems: 0, 
              totalPrice: 0, 
              isLoading: false,
              error: null 
            })
            return { success: true }
          }
          
          console.error("Cart - Error fetching cart items:", error)
          const errorMessage = error.response?.data?.message || error.message || "Failed to fetch cart items"
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
)

// Subscribe to auth store changes to clear cart when user is not authenticated
if (typeof window !== 'undefined') {
  let previousIsAuthenticated = false
  useAuthStore.subscribe((state) => {
    const isAuthenticated = state.isAuthenticated
    if (!isAuthenticated && previousIsAuthenticated) {
      // Clear cart when user becomes unauthenticated
      console.log("Cart - User not authenticated, clearing cart")
      useCartStore.setState({
        items: [],
        totalItems: 0,
        totalPrice: 0,
        isLoading: false,
        error: null
      })
    }
    previousIsAuthenticated = isAuthenticated
  })
}
