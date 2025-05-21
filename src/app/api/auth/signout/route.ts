import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * API route for handling sign-out
 * This ensures that all cookies are properly cleared
 */
export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  
  // Clear all auth-related cookies
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.startsWith("next-auth")) {
      cookieStore.delete(cookie.name);
    }
  });
  
  // Get the locale from the request URL
  const url = new URL(request.url);
  const locale = url.pathname.split("/")[1] || "en-GB";
  
  // Redirect to the home page
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

/**
 * POST handler for sign-out
 */
export async function POST(request: NextRequest) {
  // Use the auth handler for POST requests
  return auth.signOut(request);
}
