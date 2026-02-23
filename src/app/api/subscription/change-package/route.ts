import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://kulobalhealth-backend-1.onrender.com/api/v1/pharmacy"

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
    const { packageId, pharmacyId, duration = 1, paymentNeeded = false, paymentReference } = body

    if (!packageId) {
      return NextResponse.json(
        { status: "error", message: "Package ID is required" },
        { status: 400 }
      )
    }

    if (!pharmacyId) {
      return NextResponse.json(
        { status: "error", message: "Pharmacy ID is required" },
        { status: 400 }
      )
    }

    // Build request body
    const requestBody: Record<string, any> = { 
      newPackageId: packageId, 
      pharmacyId, 
      duration 
    }
    
    // Add payment fields if payment is needed
    if (paymentNeeded) {
      requestBody.paymentNeeded = true
      if (paymentReference) {
        requestBody.paymentReference = paymentReference
      }
    }

    console.log("[Subscription Change] Request body:", requestBody)

    const response = await fetch(
      `${BACKEND_URL}/subscription/change-package`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify(requestBody),
      }
    )

    const rawText = await response.text()
    console.log("[Subscription Change] Response status:", response.status)
    console.log("[Subscription Change] Raw response:", rawText.substring(0, 500))

    let data
    try {
      data = JSON.parse(rawText)
    } catch {
      console.error("[Subscription Change] Failed to parse JSON:", rawText)
      return NextResponse.json(
        { status: "error", message: "Invalid response from server" },
        { status: 502 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: data.message || "Failed to change subscription package" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[Subscription Change] Error:", error)
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
