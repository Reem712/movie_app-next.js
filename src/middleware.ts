import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('auth-storage');

  let isAuthenticated = false;
  if (authCookie?.value) {
    try {
      let raw = authCookie.value;
      try { raw = decodeURIComponent(raw); } catch {}
      const parsed = JSON.parse(raw);
      isAuthenticated = parsed?.state?.isAuthenticated === true;
    } catch {}
  }

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p);

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};