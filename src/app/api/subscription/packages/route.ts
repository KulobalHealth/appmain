import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    console.log("[Subscription Packages] Fetching packages from backend")

    const response = await fetch(
      `${BACKEND_URL}/subscription/packages`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Cookie: `token=${token}` }),
        },
        cache: "no-store",
      }
    )

    const rawText = await response.text()
    console.log("[Subscription Packages] Response status:", response.status)
    console.log("[Subscription Packages] Raw response:", rawText.substring(0, 500))

    let data
    try {
      data = JSON.parse(rawText)
    } catch {
      console.error("[Subscription Packages] Failed to parse JSON:", rawText)
      return NextResponse.json(
        { status: "error", message: "Invalid response from server" },
        { status: 502 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: data.message || "Failed to fetch subscription packages" },
        { status: response.status }
      )
    }

    // Normalize response - backend returns data as array directly
    // Format: { status: "success", data: [{ packageName, packageId, cost, feature }, ...] }
    const packages = Array.isArray(data.data) ? data.data : (data.data?.packages || data.packages || [])
    
    return NextResponse.json({
      status: "success",
      statusCode: 200,
      data: packages // Pass through as data (array) to match frontend expectation
    })
  } catch (error: any) {
    console.error("Error fetching subscription packages:", error)
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
