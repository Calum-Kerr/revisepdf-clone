"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useMockSession } from "@/providers/auth-provider";

interface PageProps {
  params: {
    locale: string;
  };
}

export default function SignOutPage({ params }: PageProps) {
  const { locale } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Get authentication status
  const mockSession = useMockSession();
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";

  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      if (isDemoMode) {
        // Clear mock session in demo mode
        await mockSession.signOut();
        router.push(`/${locale}`);
      } else {
        // Use our custom API route for more reliable sign-out
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
      }
    } catch (error) {
      console.error("Sign out error:", error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${locale}`);
  };

  return (
    <div className="container py-10 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 pb-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <LogOut className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Sign Out</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Are you sure you want to sign out of your account?
          </p>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing out..." : "Yes, Sign Out"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
