import { create } from "zustand"
import axios from "axios"
import { useAuthStore } from "@/store/auth-store"

export interface DeliveryAddress {
  id: string
  location: string // region/city
  streetAddress: string // specific address/location
  gpsAddress: string // GPS coordinates
  isDefault: boolean
  region?: string
  city?: string
  gps?: string
}

interface DeliveryAddressState {
  addresses: DeliveryAddress[]
  selectedAddressId: string
  isLoading: boolean
  error: string | null
  fetchAddresses: () => Promise<{ success: boolean; error?: string }>
  addAddress: (address: {
    location: string
    streetAddress: string
    gpsAddress: string
  }) => Promise<{ success: boolean; error?: string }>
  updateAddress: (id: string, address: {
    location?: string
    streetAddress?: string
    gpsAddress?: string
  }) => Promise<{ success: boolean; error?: string }>
  deleteAddress: (id: string) => Promise<{ success: boolean; error?: string }>
  setSelectedAddress: (id: string) => void
  clearError: () => void
}

export const useDeliveryAddressStore = create<DeliveryAddressState>()(
  (set, get) => ({
    addresses: [],
    selectedAddressId: "",
    isLoading: false,
    error: null,

      fetchAddresses: async () => {
        const user = useAuthStore.getState().user
        const pharmacyId = user?.pharmacyId || (typeof user?.pharmacy === 'object' ? user.pharmacy?.pharmacyId : user?.pharmacy)
        
        if (!pharmacyId) {
          set({ error: "Pharmacy ID not found. Please log in again.", isLoading: false })
          return { success: false, error: "Pharmacy ID not found. Please log in again." }
        }

        set({ isLoading: true, error: null })
        
        try {
          const response = await axios.get(`/api/delivery-address?pharmacyId=${pharmacyId}`, {
            withCredentials: true
          })

          const { data } = response
          if (data.status === 'success' && data.data) {
            const transformedAddresses: DeliveryAddress[] = data.data.map((addr: any) => ({
              id: addr.id || addr._id,
              location: addr.region || addr.city || addr.location || "",
              streetAddress: addr.location || addr.streetAddress || "",
              gpsAddress: addr.gps || addr.gpsAddress || "",
              isDefault: addr.isDefault || false,
              region: addr.region,
              city: addr.city,
              gps: addr.gps,
            }))

            // Select the default address if available
            const defaultAddress = transformedAddresses.find(addr => addr.isDefault)
            const selectedId = defaultAddress?.id || (transformedAddresses.length > 0 ? transformedAddresses[0].id : "")

            set({
              addresses: transformedAddresses,
              selectedAddressId: selectedId,
              isLoading: false
            })
            return { success: true }
          } else {
            set({ error: data.message || "Failed to fetch addresses", isLoading: false })
            return { success: false, error: data.message || "Failed to fetch addresses" }
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Failed to fetch addresses"
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      addAddress: async (addressData) => {
        const user = useAuthStore.getState().user
        const pharmacyId = user?.pharmacyId || (typeof user?.pharmacy === 'object' ? user.pharmacy?.pharmacyId : user?.pharmacy)
        
        if (!pharmacyId) {
          set({ error: "Pharmacy ID not found. Please log in again.", isLoading: false })
          return { success: false, error: "Pharmacy ID not found. Please log in again." }
        }

        const currentAddresses = get().addresses
        if (currentAddresses.length >= 5) {
          set({ error: "Maximum 5 addresses allowed", isLoading: false })
          return { success: false, error: "Maximum 5 addresses allowed" }
        }

        set({ isLoading: true, error: null })

        try {
          const response = await axios.post(`/api/delivery-address`, {
            pharmacyId,
            region: addressData.location,
            city: addressData.location,
            location: addressData.streetAddress,
            gps: addressData.gpsAddress || ""
          }, {
            withCredentials: true
          })

          const { data } = response
          if (data.status === 'success') {
            // Refresh addresses after adding
            await get().fetchAddresses()
            return { success: true }
          } else {
            set({ error: data.message || "Failed to add address", isLoading: false })
            return { success: false, error: data.message || "Failed to add address" }
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Failed to add address"
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      updateAddress: async (id, addressData) => {
        set({ isLoading: true, error: null })

        try {
          const response = await axios.put(`/api/delivery-address?id=${id}`, {
            ...(addressData.location && { region: addressData.location, city: addressData.location }),
            ...(addressData.streetAddress && { location: addressData.streetAddress }),
            ...(addressData.gpsAddress && { gps: addressData.gpsAddress })
          }, {
            withCredentials: true
          })

          const { data } = response
          if (data.status === 'success') {
            // Refresh addresses after updating
            await get().fetchAddresses()
            return { success: true }
          } else {
            set({ error: data.message || "Failed to update address", isLoading: false })
            return { success: false, error: data.message || "Failed to update address" }
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Failed to update address"
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      deleteAddress: async (id) => {
        set({ isLoading: true, error: null })

        try {
          const response = await axios.delete(`/api/delivery-address?id=${id}`, {
            withCredentials: true
          })

          const { data } = response
          if (data.status === 'success') {
            // Remove from local state and refresh
            const updatedAddresses = get().addresses.filter(addr => addr.id !== id)
            const newSelectedId = updatedAddresses.length > 0 
              ? (updatedAddresses.find(addr => addr.isDefault)?.id || updatedAddresses[0].id)
              : ""
            
            set({
              addresses: updatedAddresses,
              selectedAddressId: newSelectedId,
              isLoading: false
            })

            // Also refresh from DB to ensure consistency
            await get().fetchAddresses()
            return { success: true }
          } else {
            set({ error: data.message || "Failed to delete address", isLoading: false })
            return { success: false, error: data.message || "Failed to delete address" }
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Failed to delete address"
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      setSelectedAddress: (id: string) => {
        set({ selectedAddressId: id })
      },

    clearError: () => {
      set({ error: null })
    },
  })
)

