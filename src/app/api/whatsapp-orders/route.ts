import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    
    // Debug: log all cookie names
    const allCookies = cookieStore.getAll()
    console.log("[WhatsApp Orders] All cookies:", allCookies.map(c => c.name))
    console.log("[WhatsApp Orders] Token present:", !!token)

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Authentication required" },
        { status: 401 }
      )
    }

    // Use /whatsapp-order/incoming - the /all endpoint returns 404 when no orders exist
    // TODO: Backend may need to be updated to provide an endpoint that returns all statuses
    console.log("[WhatsApp Orders] Fetching from:", `${BACKEND_URL}/whatsapp-order/incoming`)

    const response = await fetch(
      `${BACKEND_URL}/whatsapp-order/incoming`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        cache: "no-store",
      }
    )

    const rawText = await response.text()
    console.log("[WhatsApp Orders] Response status:", response.status)
    console.log("[WhatsApp Orders] Raw response:", rawText.substring(0, 500))

    // Try to parse JSON
    let data
    try {
      data = JSON.parse(rawText)
    } catch {
      console.error("[WhatsApp Orders] Failed to parse JSON:", rawText)
      return NextResponse.json(
        { status: "error", message: "Invalid response from server" },
        { status: 502 }
      )
    }

    console.log("[WhatsApp Orders] Parsed data keys:", Object.keys(data))
    console.log("[WhatsApp Orders] Full parsed data:", JSON.stringify(data).substring(0, 500))

    // Handle 404 as "no orders found" - return empty array instead of error
    if (response.status === 404) {
      return NextResponse.json({
        status: "success",
        statusCode: 200,
        data: { orders: [], count: 0 }
      })
    }

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: data.message || "Failed to fetch WhatsApp orders" },
        { status: response.status }
      )
    }

    // Normalize response structure - handle different backend formats
    // The /all endpoint might return data directly or nested differently
    const normalizedData = {
      status: "success",
      statusCode: 200,
      data: {
        orders: data.data?.orders || data.orders || data.whatsappOrders || data.data || (Array.isArray(data) ? data : []),
        count: data.data?.count || data.count || data.total || 0
      }
    }
    
    console.log("[WhatsApp Orders] Normalized orders count:", normalizedData.data.orders.length)

    return NextResponse.json(normalizedData)
  } catch (error: any) {
    console.error("Error fetching WhatsApp orders:", error)
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
