"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useMockSession } from "@/providers/auth-provider";

// Separate component that uses useSearchParams
function LoginWithSearchParams({
  setError,
  setSuccess
}: {
  setError: (error: string) => void,
  setSuccess: (success: string) => void
}) {
  // Import useSearchParams inside the component
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();

  // Check for success messages from URL parameters
  useEffect(() => {
    const verified = searchParams.get("verified");
    const reset = searchParams.get("reset");

    if (verified === "true") {
      setSuccess("Your email has been verified. You can now log in.");
    }

    if (reset === "true") {
      setSuccess("Your password has been reset. You can now log in with your new password.");
    }
  }, [searchParams, setSuccess]);

  return null; // This component doesn't render anything
}

interface LoginClientProps {
  locale: string;
}

export default function LoginClient({ locale }: LoginClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Always call hooks at the top level, regardless of condition
  const mockSession = useMockSession();
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use mock session in static exports
      if (isDemoMode) {
        // Simulate authentication success with mock credentials
        if (email === "user@example.com" && password === "password123") {
          // Update mock session
          await mockSession.update();

          // Redirect to homepage after successful login
          // Force a hard refresh to ensure all components update their auth state
          window.location.href = `/${locale}`;
        } else {
          setError("Invalid email or password");
        }
        setIsLoading(false);
        return;
      }

      // Use real NextAuth otherwise
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error === "CredentialsSignin"
          ? "Invalid email or password"
          : result.error);
        setIsLoading(false);
        return;
      }

      // Redirect to homepage after successful login
      // Force a hard refresh to ensure all components update their auth state
      window.location.href = `/${locale}`;
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Use mock session in static exports
      if (isDemoMode) {
        // Update mock session
        await mockSession.update();

        // Redirect to homepage after successful login
        // Force a hard refresh to ensure all components update their auth state
        window.location.href = `/${locale}`;
        return;
      }

      // Use real NextAuth otherwise
      await signIn("google", { callbackUrl: `/${locale}` });
    } catch (error) {
      console.error("Google login error:", error);
      setError("An error occurred during Google login");
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-6 sm:py-10 flex justify-center px-4">
      {/* Wrap the component that uses useSearchParams in Suspense */}
      <Suspense fallback={null}>
        <LoginWithSearchParams setError={setError} setSuccess={setSuccess} />
      </Suspense>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 pb-2 sm:pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            Sign in to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm flex items-start">
              <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                <Link
                  href={`/${locale}/auth/forgot-password`}
                  className="text-xs sm:text-sm text-[#238287] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-sm sm:text-base h-9 sm:h-10"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#238287] hover:bg-[#1e6c6d] text-sm sm:text-base h-9 sm:h-10"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full text-sm sm:text-base h-9 sm:h-10"
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Google
          </Button>

          <div className="mt-4 text-center text-sm sm:text-base">
            Don't have an account?{" "}
            <Link
              href={`/${locale}/auth/register`}
              className="text-[#238287] hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
