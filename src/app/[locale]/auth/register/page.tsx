import { Metadata } from "next";
import { Suspense } from "react";
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

// Loading fallback component
function RegisterFallback() {
  return (
    <div className="container py-6 sm:py-10 flex justify-center px-4">
      <div className="w-full max-w-md p-6 border rounded-lg shadow-sm">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default async function RegisterPage({ params }: PageProps) {
  // Await params to fix the warning
  const { locale } = await params;

  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterClient locale={locale} />
    </Suspense>
  );
}
