import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check for token cookie (set client-side) or any auth cookie from backend
  // Try multiple possible cookie names
  const token = request.cookies.get("token")?.value || 
                request.cookies.get("auth-token")?.value ||
                request.cookies.get("access_token")?.value ||
                request.cookies.get("accessToken")?.value

  // Debug logging - log all cookies and token value
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    const allCookies = request.cookies.getAll()
    // Filter out Next.js internal cookies but keep token and auth-related cookies
    const relevantCookies = allCookies.filter(c => 
      !c.name.startsWith('__next') && 
      !c.name.startsWith('__') // Exclude all double underscore cookies
    )
    
    console.log('[Middleware] ==========================================')
    console.log('[Middleware] Path:', pathname)
    console.log('[Middleware] Full URL:', request.url)
    console.log('[Middleware] Token cookie value:', token ? token.substring(0, 30) + '...' : 'undefined')
    console.log('[Middleware] Token present:', !!token)
    console.log('[Middleware] Relevant cookie names:', relevantCookies.map(c => c.name))
    console.log('[Middleware] Relevant cookies (first 30 chars):', 
      relevantCookies.map(c => ({ 
        name: c.name, 
        value: c.value ? c.value.substring(0, 30) + '...' : 'empty',
        hasValue: !!c.value
      }))
    )
    console.log('[Middleware] ==========================================')
  }

  // Don't redirect authenticated users away from login page
  // Let the login page handle showing appropriate UI
  // The user might have an expired token and need to re-login
  // if (pathname.startsWith('/login') && token) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  // Protected routes that require authentication
  // These are routes under the (dashboard) route group
  const protectedRoutes = [
    '/dashboard',
    '/orders',
    '/patients',
    '/prescriptions',
    '/rapid-tests',
    '/store',
    '/subscriptions',
    '/account',
    '/ddi',
    '/product-detail',
    '/whatsapp-orders'
  ]

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // If accessing protected routes and not authenticated, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/checkout') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/cart') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/orders/:path*',
    '/patients/:path*',
    '/prescriptions/:path*',
    '/rapid-tests/:path*',
    '/store/:path*',
    '/subscriptions/:path*',
    '/account/:path*',
    '/ddi/:path*',
    '/product-detail/:path*',
    '/whatsapp-orders/:path*',
    '/checkout/:path*',
    '/cart',
    '/login'
  ],
}