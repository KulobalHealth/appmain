import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

// POST - Add a new condition
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('token')
    
    if (!tokenCookie) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    const url = `${API_BASE}/condition`
    console.log('[Condition Proxy] Adding condition:', url)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
      body: JSON.stringify(body),
    })
    
    const rawText = await response.text()
    console.log('[Condition Proxy] Add response status:', response.status)
    
    // Check if it's HTML (error page)
    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
      console.error('[Condition Proxy] Received HTML instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Backend returned HTML error page' },
        { status: 502 }
      )
    }
    
    // Parse JSON
    let data
    try {
      data = JSON.parse(rawText)
    } catch (e) {
      console.error('[Condition Proxy] Failed to parse JSON:', rawText.substring(0, 200))
      return NextResponse.json(
        { status: 'error', message: 'Invalid response from backend' },
        { status: 502 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Condition Proxy] Error adding condition:', error)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to add condition' },
      { status: 500 }
    )
  }
}
