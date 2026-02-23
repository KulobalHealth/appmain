import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy"

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

    console.log("[Subscription History] Fetching subscription history from backend")

    const response = await fetch(
      `${BACKEND_URL}/subscription/history`,
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
    console.log("[Subscription History] Response status:", response.status)
    console.log("[Subscription History] Raw response:", rawText.substring(0, 500))

    let data
    try {
      data = JSON.parse(rawText)
    } catch {
      console.error("[Subscription History] Failed to parse JSON:", rawText)
      return NextResponse.json(
        { status: "error", message: "Invalid response from server" },
        { status: 502 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: data.message || "Failed to fetch subscription history" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[Subscription History] Error:", error)
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
