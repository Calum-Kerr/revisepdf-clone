"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

// Separate component that uses useSearchParams
function ErrorContent() {
  // Import useSearchParams inside the component that's wrapped with Suspense
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Define error messages for different error types
  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case "AccessDenied":
        return "Access denied. You don't have permission to access this resource.";
      case "CredentialsSignin":
        return "Sign in failed. Please check your email and password.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account. Please sign in using your original provider.";
      case "OAuthSignInError":
        return "There was a problem signing in with this provider. Please try again.";
      case "OAuthCallbackError":
        return "There was a problem with the authentication callback. Please try again.";
      case "SessionRequired":
        return "This page requires you to be signed in. Please sign in to continue.";
      default:
        return "An unknown error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="text-center">
      <p className="mb-6 text-gray-700">{getErrorMessage(error)}</p>
      <div className="space-y-3">
        <Button
          asChild
          className="w-full bg-[#288283] hover:bg-[#1e6c6d]"
        >
          <Link href="/auth/login">Try Again</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full"
        >
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="container py-10 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-center">Loading error details...</div>}>
            <ErrorContent />
          </Suspense>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          <p>
            If you continue to experience issues, please{" "}
            <Link
              href="/contact"
              className="text-[#288283] hover:underline"
            >
              contact support
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
