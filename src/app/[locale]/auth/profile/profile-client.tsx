"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, User, Mail, Key } from "lucide-react";
import { useMockSession } from "@/providers/auth-provider";
import UserAvatar from "@/components/auth/user-avatar";

interface ProfileClientProps {
  locale: string;
}

export default function ProfileClient({ locale }: ProfileClientProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Always call hooks at the top level, regardless of condition
  const mockSession = useMockSession();
  const { data: session, status } = useSession();

  // Determine which session to use based on environment
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";
  const activeSession = isDemoMode ? mockSession : { data: session, status };

  // Check authentication status using our API
  useEffect(() => {
    // Make an API call to check authentication status
    const checkAuthStatus = async () => {
      try {
        // Check for saved name in localStorage for demo mode
        if (isDemoMode && typeof window !== "undefined") {
          const savedName = localStorage.getItem("mockUserName");

          if (savedName) {
            setName(savedName);
          }
        }

        const response = await fetch("/api/auth/check");
        const data = await response.json();

        if (!data.authenticated) {
          // Use window.location for a hard redirect to ensure proper authentication
          window.location.href = `/${locale}/auth/login`;
          return;
        }

        // Set initial values from API response
        if (data.user) {
          // In demo mode, prefer the localStorage value if it exists
          if (!(isDemoMode && localStorage.getItem("mockUserName"))) {
            setName(data.user.name || "");
          }
          setEmail(data.user.email || "");
        } else if (activeSession.data?.user) {
          // Fallback to session data
          // In demo mode, prefer the localStorage value if it exists
          if (!(isDemoMode && localStorage.getItem("mockUserName"))) {
            setName(activeSession.data.user.name || "");
          }
          setEmail(activeSession.data.user.email || "");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);

        // Fallback to client-side check
        if (activeSession.status === "unauthenticated") {
          window.location.href = `/${locale}/auth/login`;
          return;
        }

        // Set initial values from session
        if (activeSession.data?.user) {
          // In demo mode, prefer the localStorage value if it exists
          if (!(isDemoMode && localStorage.getItem("mockUserName"))) {
            setName(activeSession.data.user.name || "");
          }
          setEmail(activeSession.data.user.email || "");
        }
      }
    };

    checkAuthStatus();
  }, [activeSession.status, activeSession.data, locale, isDemoMode]);

  // Show loading state while checking authentication
  if (activeSession.status === "loading") {
    return (
      <div className="container py-6 sm:py-10 flex justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
            <CardDescription>
              Please wait while we load your profile
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // In demo mode, update the mock session with the new name
      if (isDemoMode) {
        setTimeout(async () => {
          // Update the mock session with the new name
          await mockSession.updateProfile(name);

          // Update the local state with the new name
          setName(name);

          setSuccess("Profile updated successfully");
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Make API call to update profile
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully");
    } catch (error: any) {
      console.error("Profile update error:", error);
      setError(error.message || "An error occurred while updating your profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // In demo mode, just simulate a successful update
      if (isDemoMode) {
        setTimeout(() => {
          setSuccess("Password updated successfully");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Make API call to update password
      const response = await fetch("/api/auth/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password update error:", error);
      setError(error.message || "An error occurred while updating your password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-6 sm:py-10 flex justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-4 mb-4">
            <UserAvatar
              user={activeSession.data?.user}
              size="lg"
              className="border border-gray-200"
            />
            <div>
              <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
              <CardDescription>
                Update your account information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 text-sm flex items-start">
              <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Email cannot be changed. Contact support if you need to update your email.
                </p>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#238287] hover:bg-[#1e6c6d]"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>

          <div className="border-t border-gray-200 pt-6">
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  Change Password
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Your current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#238287] hover:bg-[#1e6c6d]"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
