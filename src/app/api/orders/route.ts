import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://kulobalhealth-backend-1.onrender.com/api/v1/marketplace"

export async function POST(request: NextRequest) {
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
    console.log("[Orders Proxy] Creating order:", JSON.stringify(body, null, 2))

    const response = await fetch(
      `${BACKEND_URL.replace(/\/$/, "")}/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify(body),
      }
    )

    const data = await response.json()
    console.log("[Orders Proxy] Response status:", response.status)
    console.log("[Orders Proxy] Response data:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: data.message || "Failed to create order" },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[Orders Proxy] Error creating order:", error)
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
