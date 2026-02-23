import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ')
    
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    })
    
    const data = await response.json()
    
    // Create response and clear all auth cookies
    const nextResponse = NextResponse.json(data, { status: response.status })
    
    // Clear cookies on logout
    allCookies.forEach(cookie => {
      nextResponse.cookies.delete(cookie.name)
    })
    
    return nextResponse
  } catch (error: any) {
    console.error('[Auth Proxy] Logout error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Logout failed' },
      { status: 500 }
    )
  }
}
