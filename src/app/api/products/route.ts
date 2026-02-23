import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Products endpoint
const API_BASE = 'https://kulobalhealth-backend-1.onrender.com/api/v1/marketplace'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    // Only include the token cookie for auth
    const tokenCookie = allCookies.find(c => c.name === 'token')
    const cookieHeader = tokenCookie ? `token=${tokenCookie.value}` : ''
    
    const url = `${API_BASE}/product/all`
    console.log('[Products Proxy] Fetching URL:', url)
    console.log('[Products Proxy] Token cookie present:', !!tokenCookie)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    })
    
    console.log('[Products Proxy] Response status:', response.status)
    
    // Check if response is HTML (error page)
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('text/html')) {
      console.log('[Products Proxy] Received HTML instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Backend returned HTML error page' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Products Proxy] Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
