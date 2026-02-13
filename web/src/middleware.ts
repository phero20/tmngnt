import { type NextRequest, NextResponse } from 'next/server';
import { envConfig } from '@/config/env.config';

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/register');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isHostRoute = pathname.startsWith('/dashboard/host');

  // 1. If trying to access Auth pages while logged in -> Redirect to Dashboard
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Protect Dashboard from non-logged in users
  if (isDashboardPage && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Role-Based Verification for specific routes
  if (isDashboardPage && sessionToken) {
    try {
      const response = await fetch(
        `${envConfig.get('NEXT_PUBLIC_BACKEND_URL')}/api/auth/get-session`,
        {
          headers: {
            cookie: request.headers.get('cookie') || '',
          },
        }
      );

      if (!response.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const session = await response.json();
      const role = session?.user?.role;

      // Prevent non-hosts from accessing host dashboards
      if (isHostRoute && role !== 'HOST' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Middleware Auth Error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
