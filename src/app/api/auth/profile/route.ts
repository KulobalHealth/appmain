import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    // Build cookie header from all stored cookies
    const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ')
    
    console.log('[Profile Proxy] Fetching from:', `${API_BASE}/auth/profile`)
    console.log('[Profile Proxy] Cookies being sent:', allCookies.map(c => c.name).join(', ') || 'NONE')
    
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    })
    
    const data = await response.json()
    
    console.log('[Profile Proxy] Response status:', response.status)
    console.log('[Profile Proxy] Full response data:', JSON.stringify(data, null, 2))
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Profile Proxy] Profile error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
