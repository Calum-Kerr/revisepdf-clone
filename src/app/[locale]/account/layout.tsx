import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Account Settings | RevisePDF",
  description: "Manage your RevisePDF account settings and preferences",
};

interface AccountLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function AccountLayout({
  children,
  params,
}: AccountLayoutProps) {
  // Check if we're in demo mode
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";

  // Check for mock session in demo mode
  let hasMockSession = false;
  if (isDemoMode) {
    // Check for mock session cookie
    const cookieStore = cookies();
    const mockSessionCookie = cookieStore.get('mockSessionActive');
    hasMockSession = mockSessionCookie?.value === 'true';
    
    // If we have a mock session in demo mode, allow access
    if (hasMockSession) {
      return <>{children}</>;
    }
  }

  // Server-side authentication check for non-demo mode
  try {
    // Get the session using auth()
    const session = await auth();
    
    // If no session, redirect to login
    if (!session?.user) {
      redirect(`/${params.locale}/auth/login?callbackUrl=/${params.locale}/account`);
    }
  } catch (error) {
    console.error("Account Layout - Server-side auth check failed:", error);
    // Redirect to login
    redirect(`/${params.locale}/auth/login?callbackUrl=/${params.locale}/account`);
  }

  return <>{children}</>;
}
