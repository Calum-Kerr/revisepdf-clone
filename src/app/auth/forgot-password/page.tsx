"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockKeyhole, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Make API call to send a password reset email
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          locale: "en-GB", // Use British English as default
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send password reset email");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message || "An error occurred while processing your request");
    } finally {
      setIsLoading(false);
    }
  };

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
              Check Your Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="mb-6 text-gray-700">
                We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions to reset your password.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                The link will expire in 60 minutes. If you don't see the email, check your spam folder.
              </p>
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-[#238287] hover:bg-[#1e6c6d]"
                >
                  <Link href="/auth/login">Return to Login</Link>
                </Button>
              </div>
            </div>
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
            Reset Your Password
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
            Enter the email address associated with your account, and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm sm:text-base h-9 sm:h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#238287] hover:bg-[#1e6c6d] mt-2 h-9 sm:h-10 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
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
