import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

// GET - Fetch all low-stock and out-of-stock inventory items
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const lowStockUrl = `${API_BASE_URL}/inventory/low-stock/all`
    console.log('[Inventory API] Fetching low-stock from:', lowStockUrl)
    
    const response = await fetch(lowStockUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
    })
    
    // Check if response is HTML (error page)
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('text/html')) {
      console.error('[Inventory API] Low-stock - Received HTML response instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Server returned an error page' },
        { status: 500 }
      )
    }
    
    const text = await response.text()
    console.log('[Inventory API] Low-stock - Response status:', response.status)
    console.log('[Inventory API] Low-stock - Response text:', text.slice(0, 500))
    
    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('[Inventory API] Low-stock - Failed to parse JSON:', e)
      return NextResponse.json(
        { status: 'error', message: 'Invalid response from server' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Inventory API] Low-stock GET error:', error)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch low-stock inventory' },
      { status: 500 }
    )
  }
}
