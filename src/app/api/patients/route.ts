import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('token')
    
    if (!tokenCookie) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Get pharmacyId from query params
    const { searchParams } = new URL(request.url)
    const pharmacyId = searchParams.get('pharmacyId')
    
    if (!pharmacyId) {
      return NextResponse.json(
        { status: 'error', message: 'pharmacyId is required' },
        { status: 400 }
      )
    }
    
    // pharmacyId is passed but the endpoint doesn't need it in the URL
    // The backend uses the token to determine the pharmacy
    const url = `${API_BASE}/patient`
    console.log('[Patients Proxy] Fetching:', url)
    console.log('[Patients Proxy] Token (first 30 chars):', tokenCookie.value.substring(0, 30))
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
    })
    
    // Get raw text first to see what we're getting
    const rawText = await response.text()
    console.log('[Patients Proxy] Response status:', response.status)
    console.log('[Patients Proxy] Raw response (first 200 chars):', rawText.substring(0, 200))
    
    // Check if it's HTML (error page)
    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
      console.error('[Patients Proxy] Received HTML instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Backend returned HTML error page', data: [] },
        { status: 502 }
      )
    }
    
    // Parse JSON
    const data = JSON.parse(rawText)
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Patients Proxy] Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

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
    
    const response = await fetch(`${API_BASE}/patient/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Patients Proxy] Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to add patient' },
      { status: 500 }
    )
  }
}
