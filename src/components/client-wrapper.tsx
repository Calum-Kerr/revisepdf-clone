'use client';

import { ReactNode, useEffect, useState } from 'react';

/**
 * A wrapper component that only renders its children on the client side.
 * This helps prevent hydration errors and issues with client components
 * during static generation.
 */
export default function ClientWrapper({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
}
