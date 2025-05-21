import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Profile Settings | RevisePDF",
  description: "Manage your RevisePDF account settings and preferences",
};

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function ProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  // Check if we're in demo mode
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";

  // Check for mock session in demo mode
  let hasMockSession = false;
  if (isDemoMode) {
    // Check for mock session cookie - make sure to await cookies()
    const cookieStore = await cookies();
    const mockSessionCookie = cookieStore.get('mockSessionActive');
    hasMockSession = mockSessionCookie?.value === 'true';
    console.log(`Profile Layout - Demo Mode: ${isDemoMode}, Mock Session: ${hasMockSession}`);

    // If we have a mock session in demo mode, allow access
    if (hasMockSession) {
      console.log("Profile Layout - Mock session found, allowing access");
      return <>{children}</>;
    }
  }

  // Server-side authentication check for non-demo mode
  try {
    // Get the session using auth()
    const session = await auth();
    console.log("Profile Layout - Server-side auth check:", {
      sessionExists: !!session,
      userExists: !!session?.user,
      user: session?.user,
    });

    // If no session, redirect to login
    if (!session?.user) {
      console.log("Profile Layout - No session, redirecting to login");
      redirect(`/${params.locale}/auth/login?callbackUrl=/${params.locale}/auth/profile`);
    }
  } catch (error) {
    console.error("Profile Layout - Server-side auth check failed:", error);
    // Redirect to login
    redirect(`/${params.locale}/auth/login?callbackUrl=/${params.locale}/auth/profile`);
  }

  return <>{children}</>;
}
