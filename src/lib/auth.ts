import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Get the current session on the server
 */
export async function getSession() {
  const session = await auth();
  console.log("getSession - Session exists:", !!session?.user);
  return session;
}

/**
 * Check if the user is authenticated on the server
 * If not, redirect to the login page
 */
export async function requireAuth(locale = "en-GB") {
  const session = await getSession();
  console.log("requireAuth - Session user:", session?.user);

  if (!session?.user) {
    console.log("requireAuth - No session, redirecting to login");
    redirect(`/${locale}/auth/login`);
  }

  return session;
}

/**
 * Check if the user is authenticated on the server
 * Returns the session if authenticated, null otherwise
 */
export async function checkAuth() {
  const session = await getSession();
  return session?.user ? session : null;
}

/**
 * Get the current user from the session on the server
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Check if the user is authenticated on the server
 * If authenticated, redirect to the specified page
 */
export async function redirectIfAuthenticated(locale = "en-GB") {
  const session = await getSession();

  if (session?.user) {
    redirect(`/${locale}`);
  }
}

/**
 * Get the locale from the URL path
 * Defaults to en-GB if not found
 */
export function getLocaleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);

  if (segments.length > 0) {
    const firstSegment = segments[0];

    // Check if the first segment is a valid locale
    const validLocales = ['en-GB', 'en', 'es', 'fr', 'de', 'pt-BR', 'hi', 'ru', 'ko', 'vi', 'en-CA', 'es-MX'];

    if (validLocales.includes(firstSegment)) {
      return firstSegment;
    }
  }

  return 'en-GB'; // Default to British English
}
