import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    
    // Create response
    const nextResponse = NextResponse.json(data, { status: response.status })
    
    // Forward Set-Cookie headers from backend (user might be logged in after verification)
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(',').map(c => c.trim())
      cookies.forEach(cookie => {
        const [nameValue] = cookie.split(';')
        const [name, value] = nameValue.split('=')
        
        if (name && value) {
          nextResponse.cookies.set({
            name: name.trim(),
            value: value.trim(),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          })
        }
      })
    }
    
    return nextResponse
  } catch (error: any) {
    console.error('[Auth Proxy] Verify OTP error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'OTP verification failed' },
      { status: 500 }
    )
  }
}
