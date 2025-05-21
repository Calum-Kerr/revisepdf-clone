"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, History } from "lucide-react";
import { useMockSession } from "@/providers/auth-provider";
import AuthLinks from "@/components/auth/auth-links";
import UserAvatar from "@/components/auth/user-avatar";

export default function UserMenu() {
  // Always call both hooks unconditionally to comply with React hooks rules
  const mockSession = useMockSession();
  const { data: session, status } = useSession();
  const params = useParams();
  const locale = params?.locale || "en-GB";

  // Determine which session to use based on environment
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";
  const activeSession = isDemoMode ? mockSession : { data: session, status };
  const isAuthenticated = activeSession.status === "authenticated";

  // Debug authentication state
  console.log("UserMenu - isDemoMode:", isDemoMode);
  console.log("UserMenu - Session Status:", status);
  console.log("UserMenu - Mock Session Status:", mockSession.status);
  console.log("UserMenu - Active Session Status:", activeSession.status);
  console.log("UserMenu - isAuthenticated:", isAuthenticated);

  const handleSignOut = async () => {
    if (isDemoMode) {
      // Clear mock session in demo mode
      await mockSession.signOut();
      window.location.href = `/${locale}`;
    } else {
      // Use our custom API route for more reliable sign-out
      try {
        const response = await fetch("/api/auth/signout", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          // If the API call was successful, redirect to the home page
          window.location.href = `/${locale}`;
        } else {
          // Fallback to NextAuth's signOut function
          await signOut({ redirect: true, callbackUrl: `/${locale}` });
        }
      } catch (error) {
        // Fallback to NextAuth's signOut function
        await signOut({ redirect: true, callbackUrl: `/${locale}` });
      }
    }
  };

  // Import and use the AuthLinks component for non-authenticated state
  if (!isAuthenticated) {
    return (
      <AuthLinks locale={locale} />
    );
  }

  const userData = activeSession.data?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 px-2 py-1 border rounded-md border-input hover:bg-accent hover:text-accent-foreground h-7 sm:h-9">
          <UserAvatar user={userData} size="sm" />
          <span className="hidden md:inline-block truncate max-w-[80px] sm:max-w-[120px] text-xs sm:text-sm">
            {userData?.name || userData?.email || "User"}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 sm:w-48 md:w-56">
        <div className="p-2 text-sm flex items-center gap-3">
          <UserAvatar user={userData} size="sm" />
          <div>
            <p className="font-medium text-xs sm:text-sm truncate">
              {userData?.name || "User"}
            </p>
            <p className="text-gray-500 text-xs truncate">
              {userData?.email || "user@example.com"}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs sm:text-sm">
          <a
            href={`/${locale}/auth/profile`}
            className="flex w-full cursor-pointer items-center"
            onClick={(e) => {
              e.preventDefault();
              console.log("UserMenu - Profile link clicked");
              // Use window.location for a hard navigation
              window.location.href = `/${locale}/auth/profile`;
            }}
          >
            <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span>Profile Settings</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-xs sm:text-sm">
          <Link
            href={`/${locale}/history`}
            className="flex w-full cursor-pointer items-center"
          >
            <History className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span>Processing History</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex cursor-pointer items-center text-red-600 focus:text-red-600 text-xs sm:text-sm"
        >
          <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
