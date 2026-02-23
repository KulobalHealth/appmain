/**
 * Client-side authentication utilities using Zustand store
 * Note: These functions are deprecated. Use useAuthStore directly instead.
 */

import { useAuthStore } from '@/store/auth-store'

export const getAuthToken = (): string | null => {
  // This function is deprecated. Use useAuthStore instead.
  console.warn('getAuthToken is deprecated. Use useAuthStore directly.')
  return null
}

export const getUserId = (): string | null => {
  // This function is deprecated. Use useAuthStore instead.
  console.warn('getUserId is deprecated. Use useAuthStore directly.')
  return null
}

export const isEmailVerified = (): boolean => {
  // This function is deprecated. Use useAuthStore instead.
  console.warn('isEmailVerified is deprecated. Use useAuthStore directly.')
  return false
}

export const isAuthenticated = (): boolean => {
  // This function is deprecated. Use useAuthStore instead.
  console.warn('isAuthenticated is deprecated. Use useAuthStore directly.')
  return false
}

export const clearAuthData = (): void => {
  // This function is deprecated. Use useAuthStore logout instead.
  console.warn('clearAuthData is deprecated. Use useAuthStore logout instead.')
}

