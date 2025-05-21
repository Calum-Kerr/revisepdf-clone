// This is a simple pass-through layout
// The middleware will handle redirecting to the correct locale

// Force dynamic rendering for this layout
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
