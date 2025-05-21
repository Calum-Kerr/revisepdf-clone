"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { useMockSession } from "@/providers/auth-provider";
import { Locale } from "@/lib/i18n";
import UserAvatar from "@/components/auth/user-avatar";

interface AuthLinksProps {
  locale?: string | Locale;
  variant?: "header" | "footer";
  loginText?: string;
  registerText?: string;
}

export default function AuthLinks({
  locale,
  variant = "header",
  loginText = "Log In",
  registerText = "Register"
}: AuthLinksProps) {
  const router = useRouter();

  // Get authentication status
  const mockSession = useMockSession();
  const { data: session, status } = useSession();

  // Determine which session to use based on environment
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";
  const activeSession = isDemoMode ? mockSession : { data: session, status };
  const isAuthenticated = activeSession.status === "authenticated";

  // Debug authentication state
  console.log("AuthLinks - isDemoMode:", isDemoMode);
  console.log("AuthLinks - Session Status:", status);
  console.log("AuthLinks - Mock Session Status:", mockSession.status);
  console.log("AuthLinks - Active Session Status:", activeSession.status);
  console.log("AuthLinks - isAuthenticated:", isAuthenticated);

  // User data
  const userData = activeSession.data?.user;

  // Ensure locale is a string and handle undefined case
  const localeString = !locale ? 'en-GB' : (typeof locale === 'string' ? locale : locale.toString());

  // Handle sign out
  const handleSignOut = async () => {
    if (isDemoMode) {
      // Clear mock session in demo mode
      await mockSession.signOut();
      router.push(`/${localeString}`);
    } else {
      // Use our custom API route for more reliable sign-out
      try {
        const response = await fetch("/api/auth/signout", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          // If the API call was successful, redirect to the home page
          window.location.href = `/${localeString}`;
        } else {
          // Fallback to NextAuth's signOut function
          await signOut({ redirect: true, callbackUrl: `/${localeString}` });
        }
      } catch (error) {
        // Fallback to NextAuth's signOut function
        await signOut({ redirect: true, callbackUrl: `/${localeString}` });
      }
    }
  };

  // Footer variant styling
  if (variant === "footer") {
    return (
      <div className="flex flex-col space-y-2">
        {isAuthenticated ? (
          // Authenticated user options
          <>
            <div className="flex items-center gap-3 text-sm text-white/90 mb-3">
              <UserAvatar
                user={userData}
                size="md"
                className="border-2 border-white/30"
              />
              <div>
                {userData?.name ? (
                  <span>Signed in as <strong>{userData.name}</strong></span>
                ) : (
                  <span>Signed in as <strong>{userData?.email}</strong></span>
                )}
              </div>
            </div>
            <a
              href={`/${localeString}/auth/profile`}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/20 bg-white/10 hover:bg-white/20 text-white h-9 rounded-md px-4 text-sm"
              onClick={(e) => {
                e.preventDefault();
                console.log("AuthLinks - Profile link clicked");
                // Use window.location for a hard navigation
                window.location.href = `/${localeString}/auth/profile`;
              }}
            >
              <Settings className="h-4 w-4 mr-1" />
              Profile Settings
            </a>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white text-[#238287] hover:bg-white/90 h-9 rounded-md px-4 text-sm w-full"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </button>
          </>
        ) : (
          // Non-authenticated user options
          <>
            <Button
              asChild
              variant="outline"
              className="border border-white/20 bg-white/10 hover:bg-white/20 text-white"
            >
              <Link href={`/${localeString}/auth/login`} prefetch={false}>
                {loginText}
              </Link>
            </Button>
            <Button
              asChild
              className="bg-white text-[#238287] hover:bg-white/90"
            >
              <Link href={`/${localeString}/auth/register`} prefetch={false}>
                {registerText}
              </Link>
            </Button>
          </>
        )}
      </div>
    );
  }

  // Header variant (default)
  return (
    <div className="flex space-x-1 sm:space-x-2">
      {!isAuthenticated ? (
        <>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm hidden sm:flex h-7 sm:h-9 px-2 sm:px-3"
          >
            <Link href={`/${localeString}/auth/login`} prefetch={false}>{loginText}</Link>
          </Button>
          <Button
            asChild
            className="bg-[#238287] hover:bg-[#1e6c6d] text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-3"
            size="sm"
          >
            <Link href={`/${localeString}/auth/register`} prefetch={false}>{registerText}</Link>
          </Button>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <UserAvatar user={userData} size="sm" />
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 px-2 py-1 h-7 sm:h-9 text-xs sm:text-sm"
          >
            <span className="hidden md:inline-block truncate max-w-[80px] sm:max-w-[120px]">
              Sign Out
            </span>
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
