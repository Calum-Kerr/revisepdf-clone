"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useMockSession } from "@/providers/auth-provider";

interface RegisterClientProps {
  locale: string;
}

export default function RegisterClient({ locale }: RegisterClientProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Get mock session for demo mode
  const mockSession = useMockSession();
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";

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
      // Handle demo mode
      if (isDemoMode) {
        // In demo mode, simulate a successful registration
        // and redirect to login page
        setTimeout(() => {
          setIsSubmitted(true);
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      // Make API call to register the user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          locale, // Use the current locale
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Show success message
      setIsSubmitted(true);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "An error occurred during registration");
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
                We've sent a verification link to <strong>{email}</strong>. Please check your email and follow the instructions to verify your account.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                If you don't see the email in your inbox, please check your spam folder.
              </p>
            </div>
            <Button
              asChild
              className="bg-[#238287] hover:bg-[#1e6c6d] w-full"
            >
              <Link href={`/${locale}/auth/login`}>
                Return to login
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
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-sm sm:text-base h-9 sm:h-10"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
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

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-sm sm:text-base h-9 sm:h-10"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="text-sm sm:text-base h-9 sm:h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#238287] hover:bg-[#1e6c6d] text-sm sm:text-base h-9 sm:h-10"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              href={`/${locale}/auth/login`}
              className="text-[#238287] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
