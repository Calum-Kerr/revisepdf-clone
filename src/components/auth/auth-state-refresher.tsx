"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMockSession } from "@/providers/auth-provider";

/**
 * This component is used to force a refresh of the authentication state
 * It doesn't render anything, but it ensures that the authentication state
 * is properly updated across all components that use it
 */
export default function AuthStateRefresher() {
  const [refreshCount, setRefreshCount] = useState(0);
  const { data: session, status, update } = useSession();
  const mockSession = useMockSession();
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";

  // Force a refresh of the authentication state every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount((prev) => prev + 1);

      // Force a refresh of the session
      if (!isDemoMode) {
        // Force a refresh of the real session
        update();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [update, isDemoMode]);

  // This component doesn't render anything
  return null;
}
