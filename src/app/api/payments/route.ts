import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://kulobalhealth-backend-1.onrender.com/api/v1/marketplace"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const pharmacyId = searchParams.get("pharmacyId")

    if (!pharmacyId) {
      return NextResponse.json(
        { status: "error", message: "pharmacyId is required" },
        { status: 400 }
      )
    }

    const url = `${BACKEND_URL}/payment/orders/${pharmacyId}`
    console.log("[Payment Orders Proxy] Fetching:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
    })

    const data = await response.json()
    console.log("[Payment Orders Proxy] Response status:", response.status)

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[Payment Orders Proxy] Error:", error)
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

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
    console.log("[Payment Orders Proxy] Creating payment:", JSON.stringify(body, null, 2))

    const url = `${BACKEND_URL}/payment/orders`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log("[Payment Orders Proxy] Response status:", response.status)
    console.log("[Payment Orders Proxy] Response data:", JSON.stringify(data, null, 2))

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[Payment Orders Proxy] Error:", error)
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
