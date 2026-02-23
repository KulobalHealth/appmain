/**
 * Utility functions for managing cookies in the browser
 */

export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return false
  
  try {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    
    // Use SameSite=None; Secure for cross-site or SameSite=Lax for same-site
    // Also ensure path is / so it's accessible from all routes
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
    const sameSite = isSecure ? 'Lax' : 'Lax' // Use Lax for development, can be None for cross-domain
    const secureFlag = isSecure ? '; Secure' : ''
    
    const cookieString = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=${sameSite}${secureFlag}`
    document.cookie = cookieString
    
    // Verify cookie was set
    const cookieSet = document.cookie.includes(`${name}=`)
    console.log(`Cookie ${name} set:`, cookieSet, 'Cookie string:', cookieString.substring(0, 100))
    return cookieSet
  } catch (error) {
    console.error(`Error setting cookie ${name}:`, error)
    return false
  }
}

export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift()
      return cookieValue ? decodeURIComponent(cookieValue) : null
    }
    return null
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error)
    return null
  }
}

export const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return false
  
  try {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
    console.log(`Cookie ${name} deleted`)
    return true
  } catch (error) {
    console.error(`Error deleting cookie ${name}:`, error)
    return false
  }
}

export const setAuthCookies = (token: string, userId: string, isEmailVerified: boolean = true) => {
  if (typeof window === 'undefined') return false
  
  try {
    const results = {
      token: setCookie('token', token, 7),
      userId: setCookie('userId', userId, 7),
      isEmailVerified: setCookie('isEmailVerified', isEmailVerified.toString(), 7)
    }
    
    console.log('Auth cookies set:', results)
    return Object.values(results).every(Boolean)
  } catch (error) {
    console.error('Error setting auth cookies:', error)
    return false
  }
}

export const clearAuthCookies = () => {
  if (typeof window === 'undefined') return false
  
  try {
    const results = {
      token: deleteCookie('token'),
      userId: deleteCookie('userId'),
      isEmailVerified: deleteCookie('isEmailVerified')
    }
    
    console.log('Auth cookies cleared:', results)
    return Object.values(results).every(Boolean)
  } catch (error) {
    console.error('Error clearing auth cookies:', error)
    return false
  }
}

export const debugCookies = () => {
  if (typeof window === 'undefined') {
    console.log('Debug: Running on server side, no cookies available')
    return
  }
  
  console.log('=== Cookie Debug Info ===')
  console.log('All cookies:', document.cookie)
  console.log('Token cookie:', getCookie('token'))
  console.log('UserId cookie:', getCookie('userId'))
  console.log('IsEmailVerified cookie:', getCookie('isEmailVerified'))
  console.log('========================')
}
