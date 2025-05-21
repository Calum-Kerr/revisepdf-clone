"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

// Mock session context for static export mode
type MockSessionContextType = {
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  update: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
};

const MockSessionContext = createContext<MockSessionContextType>({
  data: null,
  status: "unauthenticated",
  update: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

export const useMockSession = () => useContext(MockSessionContext);

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [mockSession, setMockSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  // Check if we're in demo/static export mode
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";

  useEffect(() => {
    if (isDemoMode) {
      // Check if user was previously logged in (check both localStorage and cookie)
      const hasLocalStorage = typeof window !== "undefined" && localStorage.getItem("mockSessionActive") === "true";

      // Check for cookie
      const hasCookie = typeof window !== "undefined" && document.cookie.split(';').some(item => item.trim().startsWith('mockSessionActive=true'));

      const hasSession = hasLocalStorage || hasCookie;

      if (hasSession) {
        // Check if we have a saved user name
        const savedName = typeof window !== "undefined" ? localStorage.getItem("mockUserName") : null;

        setMockSession({
          user: {
            id: "demo-user-id",
            name: savedName || "Demo User",
            email: "user@example.com",
            image: null, // Will use initials fallback
          },
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
        });
        setStatus("authenticated");

        // Ensure both localStorage and cookie are set
        if (typeof window !== "undefined") {
          if (!hasLocalStorage) {
            localStorage.setItem("mockSessionActive", "true");
          }

          if (!hasCookie) {
            document.cookie = "mockSessionActive=true; path=/; max-age=86400"; // 24 hours
          }
        }

      } else {
        setStatus("unauthenticated");
      }
    }
  }, [isDemoMode]);

  // Update mock session (sign in)
  const updateMockSession = async () => {
    if (isDemoMode) {
      setMockSession({
        user: {
          id: "demo-user-id",
          name: "Demo User",
          email: "user@example.com",
          image: null, // Will use initials fallback
        },
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
      });
      setStatus("authenticated");
      if (typeof window !== "undefined") {
        // Set both localStorage and cookie for the mock session
        localStorage.setItem("mockSessionActive", "true");

        // Set a cookie that can be read by the middleware
        document.cookie = "mockSessionActive=true; path=/; max-age=86400"; // 24 hours
      }
    }
  };

  // Clear mock session (sign out)
  const clearMockSession = async () => {
    if (isDemoMode) {
      setMockSession(null);
      setStatus("unauthenticated");
      if (typeof window !== "undefined") {
        // Clear both localStorage and cookie for the mock session
        localStorage.removeItem("mockSessionActive");

        // Clear the cookie by setting its expiration in the past
        document.cookie = "mockSessionActive=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  };

  // Update user profile in mock session
  const updateMockProfile = async (name: string) => {
    if (isDemoMode && mockSession) {
      // Create a new session object with the updated name
      const updatedSession: Session = {
        ...mockSession,
        user: {
          ...mockSession.user,
          name: name,
        },
      };

      // Update the session state
      setMockSession(updatedSession);

      // Store the updated name in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("mockUserName", name);
      }

      return updatedSession;
    }
  };

  // Mock session provider value
  const mockSessionValue = {
    data: mockSession,
    status,
    update: updateMockSession,
    signOut: clearMockSession,
    updateProfile: updateMockProfile,
  };

  // Use a simple SessionProvider for NextAuth v5
  return (
    <SessionProvider>
      {isDemoMode ? (
        <MockSessionContext.Provider value={mockSessionValue}>
          {children}
        </MockSessionContext.Provider>
      ) : (
        children
      )}
    </SessionProvider>
  );
};

export default AuthProvider;
