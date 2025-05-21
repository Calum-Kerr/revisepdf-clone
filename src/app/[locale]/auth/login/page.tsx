import { Metadata } from "next";
import LoginClient from "./login-client";

interface PageProps {
  params: {
    locale: string;
  };
}

export const metadata: Metadata = {
  title: "Sign In | RevisePDF",
  description: "Sign in to your RevisePDF account",
};

export default async function LoginPage({ params }: PageProps) {
  // Await params to fix the warning
  const { locale } = await params;

  return <LoginClient locale={locale} />;
}
