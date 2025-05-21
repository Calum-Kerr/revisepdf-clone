import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Force dynamic rendering for this layout
export const dynamic = 'force-dynamic';

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

  // Server-side authentication check for non-demo mode
  if (!isDemoMode) {
    try {
      // Get the session using auth()
      const session = await auth();

      // If no session, redirect to login
      if (!session?.user) {
        redirect(`/${params.locale}/auth/login?callbackUrl=/${params.locale}/auth/profile`);
      }
    } catch (error) {
      console.error("Profile Layout - Server-side auth check failed:", error);
      // Redirect to login
      redirect(`/${params.locale}/auth/login?callbackUrl=/${params.locale}/auth/profile`);
    }
  }

  // In demo mode, we'll let the client-side component handle authentication

  return <>{children}</>;
}
