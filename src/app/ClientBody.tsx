"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add antialiased class to body
  useEffect(() => {
    // This component only runs on the client side
    try {
      if (document.body.className.indexOf('antialiased') === -1) {
        document.body.className += ' antialiased';
      }
    } catch (error) {
      // Ignore errors during server rendering
    }
  }, []);

  // Return children directly without wrapping div
  return <>{children}</>;
}
