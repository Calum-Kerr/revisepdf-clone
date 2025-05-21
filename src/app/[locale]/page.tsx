import { Metadata } from "next";
import HeroSection from "@/components/home/hero-section";
import ToolGrid from "@/components/home/tool-grid";
import BenefitsSection from "@/components/home/benefits-section";
import FaqSection from "@/components/home/faq-section";
import LanguageSpecificContent from "@/components/home/language-specific-content";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

// Optional: Add page-specific metadata
export const metadata: Metadata = {
  title: "Free Online PDF Tools for Editing, Converting & Optimising"
};

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <HeroSection locale={locale} />
      <ToolGrid locale={locale} />
      <LanguageSpecificContent locale={locale} />
      <BenefitsSection locale={locale} />
      <FaqSection locale={locale} />
    </main>
  );
}
