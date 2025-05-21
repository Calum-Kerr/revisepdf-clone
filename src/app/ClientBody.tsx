"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === 'undefined') return;

    // This runs only on the client after hydration
    try {
      if (document.body.className.indexOf('antialiased') === -1) {
        document.body.className += ' antialiased';
      }
    } catch (error) {
      console.error('Error in ClientBody component:', error);
      // Continue without adding the class
    }
  }, []);

  // Return children directly without wrapping div
  return <>{children}</>;
}
