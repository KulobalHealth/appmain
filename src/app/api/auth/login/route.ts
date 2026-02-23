import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('[Login Proxy] Attempting login to:', `${API_BASE}/auth/login`)
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    })
    
    const data = await response.json()
    
    console.log('[Login Proxy] Response status:', response.status)
    console.log('[Login Proxy] Response data:', JSON.stringify(data, null, 2))
    
    // Log all response headers for debugging
    console.log('[Login Proxy] Response headers:')
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value.substring(0, 100)}`)
    })
    
    // Create response
    const nextResponse = NextResponse.json(data, { status: response.status })
    
    // Forward Set-Cookie headers from backend to browser
    const setCookies = response.headers.getSetCookie?.() || []
    console.log('[Login Proxy] Set-Cookie headers found:', setCookies.length)
    
    if (setCookies.length > 0) {
      setCookies.forEach((cookie, index) => {
        console.log(`[Login Proxy] Processing cookie ${index + 1}:`, cookie.substring(0, 80))
        
        const firstSemi = cookie.indexOf(';')
        const nameValue = firstSemi > 0 ? cookie.substring(0, firstSemi) : cookie
        const eqIndex = nameValue.indexOf('=')
        
        if (eqIndex > 0) {
          const name = nameValue.substring(0, eqIndex).trim()
          const value = nameValue.substring(eqIndex + 1).trim()
          
          console.log(`[Login Proxy] Setting cookie: ${name}`)
          
          nextResponse.cookies.set({
            name: name,
            value: value,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          })
        }
      })
    }
    
    // Also check if token is in response body (some APIs return token this way)
    const token = data?.data?.token || data?.token || data?.accessToken
    if (token && !setCookies.length) {
      console.log('[Login Proxy] Token found in response body, setting as cookie')
      nextResponse.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }
    
    return nextResponse
  } catch (error: any) {
    console.error('[Login Proxy] Login error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Login failed' },
      { status: 500 }
    )
  }
}
