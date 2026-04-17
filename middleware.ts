import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const MOBILE_UA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    const ua = request.headers.get('user-agent') ?? ''
    if (MOBILE_UA.test(ua)) {
      return NextResponse.redirect(new URL('/m', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|m).*)'],
}
