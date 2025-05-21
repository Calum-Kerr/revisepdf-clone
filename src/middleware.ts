import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { auth } from './auth';

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

// Main middleware function
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle NextAuth.js authentication
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check if we're in demo mode
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";

  // Check for mock session in demo mode
  let hasMockSession = false;
  if (isDemoMode) {
    // Check for mock session cookie
    const mockSessionCookie = request.cookies.get('mockSessionActive');
    hasMockSession = mockSessionCookie?.value === 'true';
  }

  // Get the token directly from the request for all routes
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production"
  });

  // Determine if the user is authenticated (either by token or mock session)
  const isAuthenticated = !!token || (isDemoMode && hasMockSession);

  // Token information is available for debugging if needed in development
  // but we don't log it in production

  // Get the locale from the URL
  const locale = pathname.split('/')[1] || 'en-GB';

  // Handle authentication for auth routes
  if (pathname.includes('/auth/')) {
    // If user is authenticated and trying to access login or register pages,
    // redirect them to the home page
    if (isAuthenticated && (
      pathname.includes('/auth/login') ||
      pathname.includes('/auth/register')
    )) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  // Handle protected routes that require authentication
  if (pathname.includes('/auth/profile') ||
      pathname.includes('/history') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/account')) {

    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
      const url = new URL(`/${locale}/auth/login`, request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // All protected routes are now handled in the section above

  // Apply the internationalization middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // -  if they start with `/trpc`, `/_next` or `/_vercel`
  // -  the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!trpc|_next|_vercel|.*\\..*).*)']
};
