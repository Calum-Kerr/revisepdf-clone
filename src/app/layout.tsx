// This is a simple pass-through layout
// The middleware will handle redirecting to the correct locale

// Use dynamicParams instead of dynamic to avoid conflicts
export const dynamicParams = true;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
