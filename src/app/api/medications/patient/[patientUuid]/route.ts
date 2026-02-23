import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

// GET - Fetch medications for a patient
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientUuid: string }> }
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
    
    const { patientUuid } = await params
    
    if (!patientUuid) {
      return NextResponse.json(
        { status: 'error', message: 'Patient UUID is required' },
        { status: 400 }
      )
    }
    
    const url = `${API_BASE}/medication/patient/${patientUuid}`
    console.log('[Medication Proxy] Fetching medications for patient:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
    })
    
    const rawText = await response.text()
    console.log('[Medication Proxy] Response status:', response.status)
    
    // Check if it's HTML (error page)
    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
      console.error('[Medication Proxy] Received HTML instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Backend returned HTML error page', data: [] },
        { status: 502 }
      )
    }
    
    // Parse JSON
    let data
    try {
      data = JSON.parse(rawText)
    } catch (e) {
      console.error('[Medication Proxy] Failed to parse JSON:', rawText.substring(0, 200))
      return NextResponse.json(
        { status: 'error', message: 'Invalid JSON response from backend', data: [] },
        { status: 502 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Medication Proxy] Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch medications', data: [] },
      { status: 500 }
    )
  }
}
