import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

// DELETE - Delete an inventory item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'Inventory item ID is required' },
        { status: 400 }
      )
    }
    
    const deleteUrl = `${API_BASE_URL}/inventory/${id}`
    console.log('[Inventory API] DELETE - Sending to:', deleteUrl)
    
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
    })
    
    const text = await response.text()
    console.log('[Inventory API] DELETE - Response status:', response.status)
    console.log('[Inventory API] DELETE - Response text:', text.slice(0, 500))
    
    // Check if it's HTML (error page)
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      console.error('[Inventory API] DELETE - Received HTML response')
      return NextResponse.json(
        { status: 'error', message: 'Server error. Please try again later.' },
        { status: 500 }
      )
    }
    
    // Try to parse as JSON
    let data
    try {
      data = text ? JSON.parse(text) : { status: 'success', message: 'Deleted successfully' }
    } catch (e) {
      // If response is empty or not JSON but status is OK, treat as success
      if (response.ok) {
        return NextResponse.json(
          { status: 'success', message: 'Product deleted successfully' },
          { status: 200 }
        )
      }
      console.error('[Inventory API] DELETE - Failed to parse JSON:', text.slice(0, 200))
      return NextResponse.json(
        { status: 'error', message: text.slice(0, 200) || 'Unknown server error' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Inventory API] DELETE error:', error)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to delete inventory item' },
      { status: 500 }
    )
  }
}
