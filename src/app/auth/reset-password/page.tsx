"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockKeyhole, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    // Get token from URL
    const urlToken = searchParams.get("token");
    if (!urlToken) {
      setTokenError(true);
      return;
    }
    setToken(urlToken);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // Make API call to reset password
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message || "An error occurred while resetting your password");
    } finally {
      setIsLoading(false);
    }
  };

  // If token is missing or invalid
  if (tokenError) {
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
              Invalid Reset Link
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-gray-700">
              The password reset link is invalid or has expired. Please request a new password reset link.
            </p>
            <Button
              asChild
              className="w-full bg-[#238287] hover:bg-[#1e6c6d] mt-2 h-9 sm:h-10 text-sm sm:text-base"
            >
              <Link href="/auth/forgot-password">
                Request New Link
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If password reset is successful
  if (isSubmitted) {
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
              Password Reset Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-gray-700">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Button
              asChild
              className="w-full bg-[#238287] hover:bg-[#1e6c6d] mt-2 h-9 sm:h-10 text-sm sm:text-base"
            >
              <Link href="/auth/login?reset=true">
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
            <div className="p-2 bg-blue-100 rounded-full">
              <LockKeyhole className="h-8 w-8 text-[#238287]" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            Create New Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="mb-4 text-gray-600 text-center">
            Please enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-sm sm:text-base h-9 sm:h-10"
              />
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="text-sm sm:text-base h-9 sm:h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#238287] hover:bg-[#1e6c6d] mt-2 h-9 sm:h-10 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center pb-4 sm:pb-6 pt-1 sm:pt-2">
          <p className="text-xs sm:text-sm text-gray-600">
            Remembered your password?{" "}
            <Link
              href="/auth/login"
              className="text-[#238287] hover:underline font-medium"
            >
              Back to Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
