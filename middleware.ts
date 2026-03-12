import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('crm_auth_token')?.value
  const { pathname } = request.nextUrl

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
