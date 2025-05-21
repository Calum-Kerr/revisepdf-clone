"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    if (document.body.className.indexOf('antialiased') === -1) {
      document.body.className += ' antialiased';
    }
  }, []);

  // Return children directly without wrapping div
  return <>{children}</>;
}
