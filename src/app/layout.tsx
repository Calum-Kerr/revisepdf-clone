// This is a simple pass-through layout
// The middleware will handle redirecting to the correct locale

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
