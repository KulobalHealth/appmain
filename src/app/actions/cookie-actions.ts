"use server"

import { cookies } from "next/headers"

export async function setAuthCookie(userData: Record<string, unknown>) {
  const cookieStore = await cookies()

  // Set HTTP-only cookie for better security
  cookieStore.set("auth-token", JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies()

  // Set token cookie that middleware can read (server-side only)
  cookieStore.set("token", token, {
    httpOnly: false, // Must be false for middleware access
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function removeTokenCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
}

export async function getAuthCookie() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("auth-token")

  if (!authCookie) return null

  try {
    return JSON.parse(authCookie.value)
  } catch {
    return null
  }
}
