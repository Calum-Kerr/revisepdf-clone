import { Metadata } from "next";
import ProfileClient from "./profile-client";

interface PageProps {
  params: {
    locale: string;
  };
}

export const metadata: Metadata = {
  title: "Profile Settings | RevisePDF",
  description: "Manage your RevisePDF account settings and preferences",
};

export default async function ProfilePage({ params }: PageProps) {
  // Await params to fix the warning
  const { locale } = await params;

  return <ProfileClient locale={locale} />;
}
