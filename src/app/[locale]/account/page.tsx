"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, ShieldCheck, Settings, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useMockSession } from "@/providers/auth-provider";

// Force dynamic rendering to prevent prerendering errors
export const dynamic = 'force-dynamic';

// Separate component that safely uses useSession
function AccountWithSession({
  locale,
  setName,
  setEmail,
  setStatus
}: {
  locale: string,
  setName: (name: string) => void,
  setEmail: (email: string) => void,
  setStatus: (status: "loading" | "authenticated" | "unauthenticated") => void
}) {
  // Import useSession inside the component
  const { useSession } = require("next-auth/react");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle authentication redirects
  React.useEffect(() => {
    setStatus(status);
    if (status === "unauthenticated") {
      router.push(`/${locale}/auth/login`);
    }
  }, [status, router, locale, setStatus]);

  // Update form values when session data is available
  React.useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session, setName, setEmail]);

  return null; // This component doesn't render anything
}

interface PageProps {
  params: {
    locale: string;
  };
}

export default function AccountPage({ params }: PageProps) {
  const { locale } = params;
  const router = useRouter();
  const mockSession = useMockSession();
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";

  // State for authentication status
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  // Initialize state for form values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Preference state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [promptBeforeDelete, setPromptBeforeDelete] = useState(true);
  const [autoSaveFiles, setAutoSaveFiles] = useState(false);
  const [showWatermark, setShowWatermark] = useState(false);

  // For demo mode, set mock data
  React.useEffect(() => {
    if (isDemoMode) {
      setName("Demo User");
      setEmail("user@example.com");
      setStatus("authenticated");
    }
  }, [isDemoMode, setName, setEmail]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="container py-10 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Validate form
      if (!name.trim()) {
        throw new Error("Name is required");
      }

      if (!email.trim()) {
        throw new Error("Email is required");
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      setMessage("Profile updated successfully");
      setIsLoading(false);
    } catch (error: any) {
      console.error("Profile update error:", error);
      setMessage(error.message || "Error updating profile");
      setIsLoading(false);
    }
  };

  const handleSecurityUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Validate form
      if (!currentPassword) {
        throw new Error("Current password is required");
      }

      if (!newPassword) {
        throw new Error("New password is required");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Show success message
      setMessage("Password updated successfully");
      setIsLoading(false);
    } catch (error: any) {
      console.error("Security update error:", error);
      setMessage(error.message || "Error updating security settings");
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      setMessage("Preferences updated successfully");
      setIsLoading(false);
    } catch (error) {
      console.error("Preferences update error:", error);
      setMessage("Error updating preferences");
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-6 md:py-10 px-4">
      {/* Wrap the component that uses useSession in Suspense */}
      <Suspense fallback={null}>
        <AccountWithSession
          locale={locale}
          setName={setName}
          setEmail={setEmail}
          setStatus={setStatus}
        />
      </Suspense>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Account Settings</h1>

      {message && (
        <div className={`p-3 md:p-4 mb-6 rounded-md text-sm md:text-base ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {message}
        </div>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 grid grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-1">
            <Settings className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start mb-6">
                <div className="bg-[#288283] text-white rounded-full p-3 mr-4">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-medium mb-1">Profile Information</h2>
                  <p className="text-sm text-gray-500">Update your personal information</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center text-sm md:text-base">
                    <User className="h-3.5 w-3.5 mr-2 text-gray-500" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="text-sm md:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center text-sm md:text-base">
                    <Mail className="h-3.5 w-3.5 mr-2 text-gray-500" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="text-sm md:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll never share your email with anyone else.
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[#288283] hover:bg-[#1e6c6d] mt-2 text-sm md:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start mb-6">
                <div className="bg-[#288283] text-white rounded-full p-3 mr-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-medium mb-1">Security Settings</h2>
                  <p className="text-sm text-gray-500">Manage your password and security preferences</p>
                </div>
              </div>

              <form onSubmit={handleSecurityUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="flex items-center text-sm md:text-base">
                    <Lock className="h-3.5 w-3.5 mr-2 text-gray-500" />
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="text-sm md:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="flex items-center text-sm md:text-base">
                    <Lock className="h-3.5 w-3.5 mr-2 text-gray-500" />
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="text-sm md:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center text-sm md:text-base">
                    <Lock className="h-3.5 w-3.5 mr-2 text-gray-500" />
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="text-sm md:text-base"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[#288283] hover:bg-[#1e6c6d] mt-2 text-sm md:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start mb-6">
                <div className="bg-[#288283] text-white rounded-full p-3 mr-4">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-medium mb-1">Application Preferences</h2>
                  <p className="text-sm text-gray-500">Customize how RevisePDF works for you</p>
                </div>
              </div>

              <form onSubmit={handlePreferencesUpdate} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm md:text-base flex items-center">
                        <Bell className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        Email Notifications
                      </Label>
                      <p className="text-xs text-gray-500">
                        Receive emails about your account and processed files
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm md:text-base">Prompt Before Delete</Label>
                      <p className="text-xs text-gray-500">
                        Show confirmation dialog before deleting files
                      </p>
                    </div>
                    <Switch
                      checked={promptBeforeDelete}
                      onCheckedChange={setPromptBeforeDelete}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm md:text-base">Auto-Save Files</Label>
                      <p className="text-xs text-gray-500">
                        Automatically save processed files to your account
                      </p>
                    </div>
                    <Switch
                      checked={autoSaveFiles}
                      onCheckedChange={setAutoSaveFiles}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm md:text-base">Show Watermark</Label>
                      <p className="text-xs text-gray-500">
                        Display RevisePDF watermark on processed files
                      </p>
                    </div>
                    <Switch
                      checked={showWatermark}
                      onCheckedChange={setShowWatermark}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[#288283] hover:bg-[#1e6c6d] mt-2 text-sm md:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
