"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SignOutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container py-10 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-gray-100 rounded-full">
              <LogOut className="h-8 w-8 text-gray-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Sign Out
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="mb-6 text-gray-700">
              Are you sure you want to sign out of your account?
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleSignOut}
                className="w-full bg-[#288283] hover:bg-[#1e6c6d]"
                disabled={isLoading}
              >
                {isLoading ? "Signing out..." : "Yes, sign me out"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          <p>
            You will need to sign in again to access your account.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
