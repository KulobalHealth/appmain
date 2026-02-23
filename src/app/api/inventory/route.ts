import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Use base URL without /pharmacy since NEXT_PUBLIC_API_URL already includes it
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy'

// GET - Fetch all inventory items
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
    
    const inventoryUrl = `${API_BASE_URL}/inventory/all`
    console.log('[Inventory API] Fetching inventory from:', inventoryUrl)
    
    const response = await fetch(inventoryUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
    })
    
    // Check if response is HTML (error page)
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('text/html')) {
      console.error('[Inventory API] Received HTML response instead of JSON')
      return NextResponse.json(
        { status: 'error', message: 'Server returned an error page' },
        { status: 500 }
      )
    }
    
    const text = await response.text()
    console.log('[Inventory API] Response status:', response.status)
    console.log('[Inventory API] Response text:', text.slice(0, 500))
    
    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('[Inventory API] Failed to parse JSON:', e)
      return NextResponse.json(
        { status: 'error', message: 'Invalid response from server' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Inventory API] GET error:', error)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

// Helper function to parse CSV content
function parseCSV(csvContent: string): Record<string, string | number>[] {
  const lines = csvContent.trim().split('\n')
  if (lines.length < 2) return []
  
  // Only these fields are allowed by the backend
  const ALLOWED_FIELDS = [
    'brand_name',
    'drug_name', 
    'generic_name',
    'quantity',
    'unit_measure',
    'cost_price',
    'selling_price',
    'category'
  ]
  
  // Parse header row (handle both comma and potential quotes)
  const headerLine = lines[0]
  const headers = parseCSVLine(headerLine)
  
  // Parse data rows
  const items: Record<string, string | number>[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const values = parseCSVLine(line)
    const item: Record<string, string | number> = {}
    
    headers.forEach((header, index) => {
      // Convert header to snake_case if needed and trim
      const key = header.trim().toLowerCase().replace(/\s+/g, '_')
      
      // Only include allowed fields
      if (ALLOWED_FIELDS.includes(key)) {
        const value = values[index]?.trim() || ''
        
        // Convert numeric fields to numbers
        if (['quantity', 'cost_price', 'selling_price'].includes(key) && value) {
          item[key] = parseFloat(value) || 0
        } else {
          item[key] = value
        }
      }
    })
    
    items.push(item)
  }
  
  return items
}

// Parse a single CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  
  return result
}

// POST - Create inventory (upload CSV and convert to JSON items array)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Get the form data from the request
    const formData = await request.formData()
    
    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { status: 'error', message: 'No file provided' },
        { status: 400 }
      )
    }
    
    console.log('[Inventory API] File received:', file.name, file.type, file.size)
    
    // Read the CSV content as text
    const csvContent = await file.text()
    console.log('[Inventory API] CSV content (first 500 chars):', csvContent.slice(0, 500))
    
    // Parse CSV to array of items
    const items = parseCSV(csvContent)
    console.log('[Inventory API] Parsed items count:', items.length)
    console.log('[Inventory API] First item:', items[0])
    
    if (items.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'CSV file is empty or has invalid format. Please ensure it has headers and data rows.' },
        { status: 400 }
      )
    }
    
    const createUrl = `${API_BASE_URL}/inventory/create`
    console.log('[Inventory API] Sending to:', createUrl)
    console.log('[Inventory API] Payload:', JSON.stringify({ items: items.slice(0, 2) }))
    
    // Send as JSON with items array
    const response = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
      body: JSON.stringify({ items }),
    })
    
    // Get response text first
    const text = await response.text()
    console.log('[Inventory API] Response status:', response.status)
    console.log('[Inventory API] Response text:', text.slice(0, 500))
    
    // Check if it's HTML (error page)
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      console.error('[Inventory API] Received HTML response')
      return NextResponse.json(
        { status: 'error', message: 'Server error. Please try again later.' },
        { status: 500 }
      )
    }
    
    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('[Inventory API] Failed to parse JSON:', text.slice(0, 200))
      return NextResponse.json(
        { status: 'error', message: text.slice(0, 200) || 'Unknown server error' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Inventory API] POST error:', error)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to create inventory' },
      { status: 500 }
    )
  }
}

// PATCH - Update inventory item (including increase quantity)
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { id, uuid, ...updateData } = body
    
    // Determine which identifier to use
    const itemId = uuid || id
    if (!itemId) {
      return NextResponse.json(
        { status: 'error', message: 'Inventory item ID (id or uuid) is required' },
        { status: 400 }
      )
    }
    
    console.log('[Inventory API] PATCH - Updating item:', itemId)
    console.log('[Inventory API] PATCH - Update data:', updateData)
    
    // Use the /inventory/update endpoint with PUT method
    const updateUrl = `${API_BASE_URL}/inventory/update`
    console.log('[Inventory API] PATCH - Sending to:', updateUrl)
    
    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
      body: JSON.stringify({ uuid: itemId, ...updateData }),
    })
    
    const text = await response.text()
    console.log('[Inventory API] PATCH - Response status:', response.status)
    console.log('[Inventory API] PATCH - Response text:', text.slice(0, 500))
    
    // Check if it's HTML (error page)
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      console.error('[Inventory API] PATCH - Received HTML response')
      return NextResponse.json(
        { status: 'error', message: 'Server error. Please try again later.' },
        { status: 500 }
      )
    }
    
    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('[Inventory API] PATCH - Failed to parse JSON:', text.slice(0, 200))
      return NextResponse.json(
        { status: 'error', message: text.slice(0, 200) || 'Unknown server error' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Inventory API] PATCH error:', error)
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to update inventory' },
      { status: 500 }
    )
  }
}
