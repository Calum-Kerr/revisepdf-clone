import { Metadata } from "next";
import RegisterClient from "./register-client";

interface PageProps {
  params: {
    locale: string;
  };
}

export const metadata: Metadata = {
  title: "Create Account | RevisePDF",
  description: "Create a new RevisePDF account",
};

export default async function RegisterPage({ params }: PageProps) {
  // Await params to fix the warning
  const { locale } = await params;

  return <RegisterClient locale={locale} />;
}
