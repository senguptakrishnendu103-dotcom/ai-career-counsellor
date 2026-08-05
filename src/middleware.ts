import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

/**
 * Middleware to protect routes based on authentication and role.
 * Add protected paths in the `protectedRoutes` array.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createRouteHandlerClient({ request, response });

  // Get session (refreshes token automatically)
  const { data: { session } } = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    '/admin',
    '/admin/',
    '/admin/*',
    '/dashboard',
    '/dashboard/',
    '/dashboard/*',
    '/mentor',
    '/mentor/*',
  ];

  const isProtected = protectedRoutes.some((p) => {
    // simple wildcard handling
    if (p.endsWith('/*')) {
      const base = p.slice(0, -2);
      return pathname.startsWith(base);
    }
    return pathname === p;
  });

  if (isProtected) {
    if (!session) {
      // Not logged in – redirect to home (or a dedicated login page)
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Role‑based protection – you can expand this as needed
    const role = (session.user?.app_metadata?.role as string) ?? '';
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/?unauthorized=true', request.url));
    }
    if (pathname.startsWith('/mentor') && role !== 'mentor') {
      return NextResponse.redirect(new URL('/?unauthorized=true', request.url));
    }
    // Student has access to generic protected routes
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/mentor/:path*',
  ],
};
