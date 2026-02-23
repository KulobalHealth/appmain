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
    const { packageId, duration, amountPaid, reference, pharmacyId } = body

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

    if (!reference) {
      return NextResponse.json(
        { status: "error", message: "Payment reference is required" },
        { status: 400 }
      )
    }

    console.log("[Subscription Enroll] Enrolling package:", { packageId, duration, amountPaid, reference, pharmacyId })

    const response = await fetch(
      `${BACKEND_URL}/subscription/enroll`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({
          packageId,
          duration: duration || 1,
          amountPaid,
          reference,
          pharmacyId
        }),
      }
    )

    const rawText = await response.text()
    console.log("[Subscription Enroll] Response status:", response.status)
    console.log("[Subscription Enroll] Raw response:", rawText.substring(0, 500))

    let data
    try {
      data = JSON.parse(rawText)
    } catch {
      console.error("[Subscription Enroll] Failed to parse JSON:", rawText)
      return NextResponse.json(
        { status: "error", message: "Invalid response from server" },
        { status: 502 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: data.message || "Failed to enroll in subscription" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[Subscription Enroll] Error:", error)
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
