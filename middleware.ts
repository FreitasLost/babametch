import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For demonstration purposes only
  // In a real application, you would check for authentication here

  const isAuthenticated = true // This would be a real check in production

  // Protected routes that require authentication
  const protectedRoutes = ["/browse", "/chat", "/profile"]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/browse/:path*", "/chat/:path*", "/profile/:path*"],
}
