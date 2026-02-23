"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"
import { Preloader } from "@/components/preloader"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initializeAuth = useAuthStore((state) => state.initializeAuth)
    const isLoading = useAuthStore((state) => state.isLoading)
    const hasInitialized = useAuthStore((state) => state.hasInitialized)

    useEffect(() => {
      // Initialize auth state on mount by checking for token cookie
      initializeAuth()
    }, [initializeAuth])

    // Show skeleton during loading states
    if (isLoading && !hasInitialized) {
      return <Preloader />
    }

    return <>{children}</>
}

