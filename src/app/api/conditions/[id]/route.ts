import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

// DELETE - Delete a condition
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('token')
    
    if (!tokenCookie) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    const url = `${API_BASE}/condition/${id}`
    console.log('[Condition Proxy] Deleting condition:', url)
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
    })
    
    const rawText = await response.text()
    console.log('[Condition Proxy] Delete response status:', response.status)
    
    // Check if it's HTML (error page)
    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
      console.error('[Condition Proxy] Received HTML instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Backend returned HTML error page' },
        { status: 502 }
      )
    }
    
    // Handle empty response (204 No Content)
    if (!rawText || rawText.trim() === '') {
      return NextResponse.json({ status: 'success' }, { status: 200 })
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
    console.error('[Condition Proxy] Error deleting condition:', error)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to delete condition' },
      { status: 500 }
    )
  }
}
