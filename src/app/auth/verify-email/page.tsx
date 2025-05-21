"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");
        
        if (!token) {
          setError("Missing verification token");
          setIsVerifying(false);
          return;
        }

        // Get the current locale
        const locale = window.location.pathname.split('/')[1] || 'en-GB';
        
        // Call the API to verify the email
        const response = await fetch(`/api/auth/verify-email?token=${token}&locale=${locale}`);
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Email verification failed");
        }
        
        setIsSuccess(true);
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push(`/${locale}/auth/login?verified=true`);
        }, 3000);
      } catch (error: any) {
        console.error("Email verification error:", error);
        setError(error.message || "An error occurred during email verification");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  if (isVerifying) {
    return (
      <div className="container py-6 sm:py-10 flex justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 pb-2 sm:pb-4">
            <div className="flex justify-center mb-2">
              <Loader2 className="h-8 w-8 text-[#238287] animate-spin" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800">
              Verifying Your Email
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700">
              Please wait while we verify your email address...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container py-6 sm:py-10 flex justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 pb-2 sm:pb-4">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800">
              Email Verified
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-gray-700">
              Your email has been verified successfully. You will be redirected to the login page shortly.
            </p>
            <Button
              asChild
              className="w-full bg-[#238287] hover:bg-[#1e6c6d] mt-2 h-9 sm:h-10 text-sm sm:text-base"
            >
              <Link href="/auth/login?verified=true">
                Go to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 sm:py-10 flex justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 pb-2 sm:pb-4">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            Verification Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm">
            {error}
          </div>
          <p className="mb-6 text-gray-700">
            The verification link may have expired or is invalid. Please try registering again or contact support.
          </p>
          <Button
            asChild
            className="w-full bg-[#238287] hover:bg-[#1e6c6d] mt-2 h-9 sm:h-10 text-sm sm:text-base"
          >
            <Link href="/auth/register">
              Register Again
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
