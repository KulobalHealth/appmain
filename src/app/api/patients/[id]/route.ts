import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

// GET - Fetch a single patient by ID
export async function GET(
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
        { status: 'error', message: 'Patient ID is required' },
        { status: 400 }
      )
    }
    
    const url = `${API_BASE}/patient/${id}`
    console.log('[Patient Proxy] Fetching patient by ID:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
    })
    
    const rawText = await response.text()
    console.log('[Patient Proxy] Response status:', response.status)
    console.log('[Patient Proxy] Raw response (first 300 chars):', rawText.substring(0, 300))
    
    // Check if it's HTML (error page)
    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
      console.error('[Patient Proxy] Received HTML instead of JSON')
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
      console.error('[Patient Proxy] Failed to parse JSON:', rawText.substring(0, 200))
      return NextResponse.json(
        { status: 'error', message: 'Invalid response from server' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Patient Proxy] Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch patient' },
      { status: 500 }
    )
  }
}
