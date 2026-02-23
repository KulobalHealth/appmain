import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

// GET - Fetch store info
export async function GET() {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('token')
    
    if (!tokenCookie) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const url = `${API_BASE}/store`
    console.log('[Store Proxy] GET Fetching:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
    })
    
    const rawText = await response.text()
    console.log('[Store Proxy] GET Response status:', response.status)
    console.log('[Store Proxy] GET Full response:', rawText)
    
    // Check if it's HTML (error page)
    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
      console.error('[Store Proxy] Received HTML instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Backend returned HTML error page', data: null },
        { status: 502 }
      )
    }
    
    const data = JSON.parse(rawText)
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Store Proxy] GET Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch store' },
      { status: 500 }
    )
  }
}

// POST - Create store
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
    
    const contentType = request.headers.get('content-type') || ''
    const url = `${API_BASE}/store`
    console.log('[Store Proxy] POST Creating store at:', url)
    
    let response: Response
    
    // Handle multipart form data (for logo upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      console.log('[Store Proxy] POST FormData entries:', Array.from(formData.keys()))
      
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Cookie': `token=${tokenCookie.value}`,
        },
        body: formData,
      })
    } else {
      // Handle JSON data
      const body = await request.json()
      console.log('[Store Proxy] POST JSON body:', body)
      
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${tokenCookie.value}`,
        },
        body: JSON.stringify(body),
      })
    }
    
    const rawText = await response.text()
    console.log('[Store Proxy] POST Response status:', response.status)
    console.log('[Store Proxy] POST Raw response (first 200 chars):', rawText.substring(0, 200))
    
    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
      console.error('[Store Proxy] Received HTML instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Backend returned HTML error page' },
        { status: 502 }
      )
    }
    
    const data = JSON.parse(rawText)
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Store Proxy] POST Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to create store' },
      { status: 500 }
    )
  }
}

// PATCH - Update store
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('token')
    
    if (!tokenCookie) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const contentType = request.headers.get('content-type') || ''
    const url = `${API_BASE}/store`
    console.log('[Store Proxy] PATCH Updating store at:', url)
    
    let response: Response
    
    // Handle multipart form data (for logo upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      
      response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Cookie': `token=${tokenCookie.value}`,
        },
        body: formData,
      })
    } else {
      const body = await request.json()
      
      response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${tokenCookie.value}`,
        },
        body: JSON.stringify(body),
      })
    }
    
    const rawText = await response.text()
    console.log('[Store Proxy] PATCH Response status:', response.status)
    
    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
      console.error('[Store Proxy] Received HTML instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Backend returned HTML error page' },
        { status: 502 }
      )
    }
    
    const data = JSON.parse(rawText)
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Store Proxy] PATCH Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to update store' },
      { status: 500 }
    )
  }
}

// DELETE - Delete store
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('token')
    
    if (!tokenCookie) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const url = `${API_BASE}/store`
    console.log('[Store Proxy] DELETE Deleting store at:', url)
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
    })
    
    const rawText = await response.text()
    console.log('[Store Proxy] DELETE Response status:', response.status)
    
    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
      console.error('[Store Proxy] Received HTML instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Backend returned HTML error page' },
        { status: 502 }
      )
    }
    
    // Handle empty response (204 No Content)
    if (!rawText) {
      return NextResponse.json({ status: 'success', message: 'Store deleted' }, { status: 200 })
    }
    
    const data = JSON.parse(rawText)
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Store Proxy] DELETE Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to delete store' },
      { status: 500 }
    )
  }
}
