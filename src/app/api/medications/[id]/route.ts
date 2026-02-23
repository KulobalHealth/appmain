import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

// DELETE - Delete a medication
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
    
    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'Medication ID is required' },
        { status: 400 }
      )
    }
    
    const url = `${API_BASE}/medication/${id}`
    console.log('[Medication Proxy] Deleting medication:', url)
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
    })
    
    const rawText = await response.text()
    console.log('[Medication Proxy] Delete response status:', response.status)
    
    // Check if it's HTML (error page)
    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
      console.error('[Medication Proxy] Received HTML instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Backend returned HTML error page' },
        { status: 502 }
      )
    }
    
    // Parse JSON if there's content
    if (rawText) {
      try {
        const data = JSON.parse(rawText)
        return NextResponse.json(data, { status: response.status })
      } catch (e) {
        // If we can't parse but status is success, return success
        if (response.status >= 200 && response.status < 300) {
          return NextResponse.json({ status: 'success', message: 'Medication deleted' }, { status: 200 })
        }
        return NextResponse.json(
          { status: 'error', message: 'Invalid JSON response from backend' },
          { status: 502 }
        )
      }
    }
    
    return NextResponse.json({ status: 'success', message: 'Medication deleted' }, { status: 200 })
  } catch (error: any) {
    console.error('[Medication Proxy] Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to delete medication' },
      { status: 500 }
    )
  }
}
