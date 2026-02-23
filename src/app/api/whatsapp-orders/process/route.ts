import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy"

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log("[WhatsApp Process API] Request body:", body)
    
    const orderId = body.orderId || body.uuid
    const status = body.status || "PROCESSING" // Default to PROCESSING, but allow CONFIRMED or CANCELLED
    
    if (!orderId) {
      return NextResponse.json(
        { status: "error", message: "Order ID is required" },
        { status: 400 }
      )
    }

    // Try different field names - backend may expect 'uuid' or 'orderId'
    const payload = {
      uuid: orderId,
      orderId: orderId,
      status: status
    }
    console.log("[WhatsApp Process API] Payload to backend:", payload)

    const response = await fetch(
      `${BACKEND_URL}/whatsapp-order/process`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify(payload),
      }
    )

    const rawText = await response.text()
    console.log("[WhatsApp Process API] Response status:", response.status)
    console.log("[WhatsApp Process API] Raw response:", rawText)

    let data
    try {
      data = rawText ? JSON.parse(rawText) : {}
    } catch {
      data = { message: rawText || "Unknown error" }
    }

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: data.message || data.error || `Backend returned status ${response.status}` },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error processing WhatsApp order:", error)
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
