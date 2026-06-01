import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if the requested route is under /admin or /api/admin
  const isAdminRoute = pathname.startsWith('/admin')
  const isApiAdminRoute = pathname.startsWith('/api/admin')

  // Allow access to the login pages/APIs
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  if (isAdminRoute || isApiAdminRoute) {
    const sessionCookie = req.cookies.get('admin_session')

    // Very basic verification: in production this should ideally be a signed JWT.
    // We are checking if the cookie exists and equals our expected basic token string.
    if (sessionCookie && sessionCookie.value === 'authenticated') {
      return NextResponse.next()
    }

    // Not authenticated
    if (isApiAdminRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    } else {
      const loginUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
}
