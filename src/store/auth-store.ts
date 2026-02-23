import { create } from "zustand"
import axios from "axios"
import { User, RegisterData } from "@/types/user"

interface AuthState {
   user: User | null
   isAuthenticated: boolean
   isEmailVerified: boolean
   isLoading: boolean
   error: string | null
   hasInitialized: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; error?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
  clearError: () => void
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  getProfile: () => Promise<{ success: boolean; error?: string }>
  initializeAuth: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()((set, get) => ({
   // Initial state
   user: null,
   isAuthenticated: false,
   isEmailVerified: false,
   isLoading: true,
   error: null,
   hasInitialized: false,

  // Login action - uses local proxy to handle cookies properly
   login: async (email, password) => {
     set({ isLoading: true, error: null })
     try {
       const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true })

       // Clear logout flag on successful login
       if (typeof window !== 'undefined') {
         localStorage.setItem('auth_logged_out', 'false')
         
         // Set a client-side auth marker cookie for middleware to detect
         // This helps the middleware know the user is authenticated
         document.cookie = `auth-token=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
         
         // Check for pending subscription enrollment
         const pendingSubscription = localStorage.getItem('pendingSubscription')
         if (pendingSubscription) {
           try {
             const { packageId, timestamp } = JSON.parse(pendingSubscription)
             // Only process if less than 1 hour old
             if (Date.now() - timestamp < 3600000) {
               await axios.post(
                 `${process.env.NEXT_PUBLIC_API_URL}/subscription/enroll`,
                 { packageId },
                 { withCredentials: true }
               )
               console.log('Pending subscription enrolled successfully')
             }
           } catch (enrollError) {
             console.log('Failed to enroll pending subscription:', enrollError)
           } finally {
             localStorage.removeItem('pendingSubscription')
           }
         }
       }

       // After successful login, fetch profile immediately
       const profileResult = await get().getProfile()
       if (!profileResult.success) {
         set({ isLoading: false })
         return { success: false, error: profileResult.error }
       }

       set({ isLoading: false })
       return { success: true }
     } catch (error: any) {
       const msg = error.response?.data?.message || error.message || "Login failed"
       set({ error: msg, isLoading: false })
       return { success: false, error: msg }
     }
   },

  // Register action - uses local proxy
  register: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post('/api/auth/register', userData, { withCredentials: true })
      const data = response.data
      const success = data?.success || data?.status === "success"

      if (!success) {
        set({ error: data.message || "Registration failed", isLoading: false })
        return { success: false, error: data.message || "Registration failed" }
      }

      set({ isLoading: false })
      return { success: true }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Registration failed"
      set({ error: msg, isLoading: false })
      return { success: false, error: msg }
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    set({ isLoading: true, error: null })

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
        email,
        code: otp
      }, { withCredentials: true })

      const { data } = response

      // Accept both legacy and new success shapes
      const okLegacy = data?.success
      const okNew = data?.status === 'success'
      if (!okLegacy && !okNew) {
        set({ error: data.message || data?.status || "OTP verification failed", isLoading: false })
        return { success: false, error: data.message || "OTP verification failed" }
      }

      // If verification is successful, set email as verified
      set({
        isEmailVerified: true,
        isLoading: false,
        error: null,
      })

      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "OTP verification failed. Please try again."
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  resendVerificationEmail: async (email: string) => {
    set({ isLoading: true, error: null })

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification-email`, {
        email
      }, { withCredentials: true })

      const { data } = response

      // Accept both legacy and new success shapes
      const okLegacy = data?.success
      const okNew = data?.status === 'success'
      if (!okLegacy && !okNew) {
        set({ error: data.message || data?.status || "Failed to resend verification email", isLoading: false })
        return { success: false, error: data.message || "Failed to resend verification email" }
      }

      set({ isLoading: false, error: null })
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to resend verification email. Please try again."
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null })

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forget-password`, {
        email
      }, { withCredentials: true })

      const { data } = response

      // Accept both legacy and new success shapes
      const okLegacy = data?.success
      const okNew = data?.status === 'success'
      if (!okLegacy && !okNew) {
        set({ error: data.message || data?.status || "Failed to send reset email", isLoading: false })
        return { success: false, error: data.message || "Failed to send reset email" }
      }

      set({ isLoading: false, error: null })
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to send reset email. Please try again."
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    set({ isLoading: true, error: null })

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        email,
        code: otp,
        newPassword
      }, { withCredentials: true })

      const { data } = response

      // Accept both legacy and new success shapes
      const okLegacy = data?.success
      const okNew = data?.status === 'success'
      if (!okLegacy && !okNew) {
        set({ error: data.message || data?.status || "Failed to reset password", isLoading: false })
        return { success: false, error: data.message || "Failed to reset password" }
      }

      set({ isLoading: false, error: null })
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to reset password. Please try again."
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  // Logout action - uses local proxy
   logout: async () => {
     set({ isLoading: true, error: null })
     try {
       const response = await axios.post('/api/auth/logout', {}, { withCredentials: true })
       const data = response.data

       // Check for success response
       const success = data?.status === "Logout successful" || data?.statusCode === 200 || data?.success

       if (!success) {
         set({ error: data?.message || "Logout failed", isLoading: false })
         return { success: false, error: data?.message || "Logout failed" }
       }

       // Mark as logged out to prevent auto re-auth on page reload
       if (typeof window !== 'undefined') {
         localStorage.setItem('auth_logged_out', 'true')
         // Clear the auth marker cookie
         document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax'
       }

       set({
         isAuthenticated: false,
         user: null,
         isLoading: false,
         error: null,
       })
       return { success: true }
     } catch (error: any) {
       const msg = error.response?.data?.message || error.message || "Logout failed"
       set({ error: msg, isLoading: false })
       return { success: false, error: msg }
     }
   },

  // Clear error
  clearError: () => set({ error: null }),

  // Update profile
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null })
    const currentUser = get().user
    if (!currentUser) {
      set({ isLoading: false, error: "No user logged in" })
      return { success: false, error: "No user logged in" }
    }

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, userData, { withCredentials: true })
      const data = response.data

      if (!data.success || !data.data?.user) {
        set({ error: data.message || "Update failed", isLoading: false })
        return { success: false, error: data.message || "Update failed" }
      }

      set({
        user: data.data.user,
        isLoading: false,
        error: null,
      })
      return { success: true }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Profile update failed"
      set({ error: msg, isLoading: false })
      return { success: false, error: msg }
    }
  },

  // Fetch profile directly from API proxy, only once
  getProfile: async () => {
    const { user } = get()
    if (user) {
      return { success: true } // Already loaded
    }

    set({ isLoading: true, error: null })
    try {
      const response = await axios.get('/api/auth/profile', { withCredentials: true })
      const data = response.data

      if (data?.status !== "success" || !data.data) {
        // Clear stale auth marker cookie when profile fails
        if (typeof window !== 'undefined') {
          document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax'
        }
        set({ isAuthenticated: false, user: null, isLoading: false })
        return { success: false, error: data.message || "Failed to fetch profile" }
      }

      set({
        user: data.data,
        isAuthenticated: true,
        isEmailVerified: data.data.verifiedUser || false,
        isLoading: false,
        error: null,
      })
      return { success: true }
    } catch (error: any) {
      // Clear stale auth marker cookie on error
      if (typeof window !== 'undefined') {
        document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax'
      }
      set({ isAuthenticated: false, user: null, isLoading: false })
      return { success: false, error: error.message || "Failed to fetch profile" }
    }
  },

  // Initialize auth: fetch profile once if user has a valid session (cookie-based)
   initializeAuth: async () => {
     if (get().hasInitialized) {
       return // Already initialized, skip
     }

     // Check if user recently logged out to prevent auto re-auth
     if (typeof window !== 'undefined' && localStorage.getItem('auth_logged_out') === 'true') {
       // Also clear stale auth marker cookie
       document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax'
       set({ isAuthenticated: false, isLoading: false, hasInitialized: true })
       return
     }

     set({ isAuthenticated: false, isLoading: true })
     try {
       const result = await get().getProfile()
       if (!result.success) {
         // Profile failed - clear marker cookie and mark as not authenticated
         if (typeof window !== 'undefined') {
           document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax'
         }
       }
     } catch (error) {
       console.log("InitializeAuth failed:", error)
       if (typeof window !== 'undefined') {
         document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax'
       }
     } finally {
       set({ isLoading: false, hasInitialized: true })
     }
   },
}))