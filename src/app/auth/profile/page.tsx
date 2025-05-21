"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, User } from "lucide-react";
import { useMockSession } from "@/providers/auth-provider";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const mockSession = useMockSession();
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileData, setProfileData] = useState<any>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated" && !isDemoMode) {
      router.push("/auth/login");
    }
  }, [status, router, isDemoMode]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (isDemoMode) {
        // Use mock data in demo mode
        setProfileData({
          id: "demo-user-id",
          name: "Demo User",
          email: "user@example.com",
          emailVerified: true,
          provider: "credentials",
          createdAt: new Date().toISOString(),
        });
        setName("Demo User");
        setEmail("user@example.com");
        return;
      }

      if (status === "authenticated" && session?.user) {
        try {
          const response = await fetch("/api/auth/profile");
          
          if (!response.ok) {
            throw new Error("Failed to fetch profile data");
          }
          
          const data = await response.json();
          setProfileData(data);
          setName(data.name || "");
          setEmail(data.email || "");
        } catch (error) {
          console.error("Error fetching profile:", error);
          setError("Failed to load profile data");
        }
      }
    };

    if (status !== "loading") {
      fetchProfile();
    }
  }, [status, session, isDemoMode]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isDemoMode) {
        // Simulate success in demo mode
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess("Profile updated successfully");
        setIsLoading(false);
        return;
      }

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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
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
      if (isDemoMode) {
        // Simulate success in demo mode
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/auth/profile", {
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

  if (status === "loading") {
    return (
      <div className="container py-6 sm:py-10 flex justify-center px-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#238287]"></div>
            </div>
            <p className="text-gray-600">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 sm:py-10 flex justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 pb-2 sm:pb-4">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-8 w-8 text-[#238287]" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            Your Profile
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

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-sm sm:text-base h-9 sm:h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="text-sm sm:text-base h-9 sm:h-10 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Email address cannot be changed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Account Type</Label>
                  <div className="p-2 border rounded-md bg-gray-50 text-sm sm:text-base">
                    {profileData?.provider === "google" ? "Google Account" : "Email & Password"}
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-[#238287] hover:bg-[#1e6c6d] mt-2 h-9 sm:h-10 text-sm sm:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="security">
              {profileData?.provider === "google" ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    You're signed in with Google. Password management is handled by your Google account.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-2 h-9 sm:h-10 text-sm sm:text-base"
                  >
                    <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer">
                      Manage Google Account
                    </a>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm sm:text-base">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm sm:text-base">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm New Password</Label>
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
                    className="w-full bg-[#238287] hover:bg-[#1e6c6d] mt-2 h-9 sm:h-10 text-sm sm:text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center pb-4 sm:pb-6 pt-1 sm:pt-2">
          <Button
            asChild
            variant="outline"
            className="text-xs sm:text-sm"
          >
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
