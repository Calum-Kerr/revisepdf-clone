import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    // Check if we're in demo mode
    const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";

    // Check for mock session in demo mode
    let hasMockSession = false;
    let mockUser = null;

    if (isDemoMode) {
      // Check for mock session cookie
      const mockSessionCookie = request.cookies.get('mockSessionActive');
      hasMockSession = mockSessionCookie?.value === 'true';

      if (hasMockSession) {
        mockUser = {
          id: "demo-user-id",
          name: "Demo User",
          email: "user@example.com",
          image: null,
        };
      }

      console.log(`API Auth Check - Demo Mode: ${isDemoMode}, Mock Session: ${hasMockSession}`);
    }

    // Get the session using auth()
    const session = await auth();

    // Get the token directly from the request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production"
    });

    // Determine if the user is authenticated (either by session, token, or mock session)
    const isAuthenticated = !!session?.user || !!token || (isDemoMode && hasMockSession);

    // Return the authentication status
    return NextResponse.json({
      authenticated: isAuthenticated,
      sessionExists: !!session,
      tokenExists: !!token,
      mockSessionExists: isDemoMode && hasMockSession,
      user: session?.user || mockUser || null,
      tokenInfo: token ? {
        sub: token.sub,
        name: token.name,
        email: token.email,
        picture: token.picture,
      } : null,
    });
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return NextResponse.json({
      authenticated: false,
      error: "Failed to check authentication status",
    }, { status: 500 });
  }
}
