import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Delivery address is in the marketplace API
const API_BASE = 'https://kulobalhealth-backend-1.onrender.com/api/v1/marketplace'

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
    
    const url = `${API_BASE}/delivery-address/${pharmacyId}`
    console.log('[Delivery Address Proxy] Fetching:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
    })
    
    const data = await response.json()
    console.log('[Delivery Address Proxy] Response status:', response.status)
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Delivery Address Proxy] Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch addresses' },
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
    console.log('[Delivery Address Proxy] Creating address:', body)
    
    const url = `${API_BASE}/delivery-address`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    console.log('[Delivery Address Proxy] Response status:', response.status)
    console.log('[Delivery Address Proxy] Response data:', data)
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Delivery Address Proxy] Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to create address' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('token')
    
    if (!tokenCookie) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('id')
    
    if (!addressId) {
      return NextResponse.json(
        { status: 'error', message: 'Address ID is required' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const url = `${API_BASE}/delivery-address/${addressId}`
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    console.log('[Delivery Address Proxy] Update response status:', response.status)
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Delivery Address Proxy] Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('token')
    
    if (!tokenCookie) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('id')
    
    if (!addressId) {
      return NextResponse.json(
        { status: 'error', message: 'Address ID is required' },
        { status: 400 }
      )
    }
    
    const url = `${API_BASE}/delivery-address/${addressId}`
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${tokenCookie.value}`,
      },
    })
    
    const data = await response.json()
    console.log('[Delivery Address Proxy] Delete response status:', response.status)
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Delivery Address Proxy] Error:', error.message)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to delete address' },
      { status: 500 }
    )
  }
}
