import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login' || path === '/signup' || path.startsWith('/api/');

  const authSession = request.cookies.get('auth_session')?.value || '';

  if (!isPublicPath && !authSession) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (isPublicPath && authSession && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
