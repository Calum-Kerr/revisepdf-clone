"use client";

import { useEffect, useState } from "react";
import { useMockSession } from "@/providers/auth-provider";
import { useSession } from "next-auth/react";

/**
 * This component is used to force a refresh of the authentication state
 * It doesn't render anything, but it ensures that the authentication state
 * is properly updated across all components that use it
 */
export default function AuthStateRefresher() {
  const [refreshCount, setRefreshCount] = useState(0);
  const mockSession = useMockSession();
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";

  // Use the session hook directly
  const { update } = useSession();

  // Force a refresh of the authentication state every second
  useEffect(() => {
    // This component only runs on the client side
    if (typeof window === 'undefined') return;

    const interval = setInterval(() => {
      setRefreshCount((prev) => prev + 1);

      // Force a refresh of the session
      if (!isDemoMode && update) {
        try {
          // Force a refresh of the real session
          update();
        } catch (e) {
          console.error('Failed to update session:', e);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [update, isDemoMode]);

  // This component doesn't render anything
  return null;
}
