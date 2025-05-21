import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ClientBody from "@/app/ClientBody";
import AuthProvider from "@/providers/auth-provider";
import NextAuthProvider from "@/providers/session-provider";
import LanguageCookie from "@/components/layout/language-cookie";
import AuthStateRefresher from "@/components/auth/auth-state-refresher";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

// Define Inter font
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

// Define base URL for canonical links and other metadata
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.revisepdf.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#238287',
  colorScheme: 'light'
};

interface Props {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Dynamic metadata generation based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "RevisePDF - Free Online PDF Tools for Editing, Converting & Optimising",
      template: `%s | RevisePDF`,
    },
    description:
      "RevisePDF offers 20+ free online PDF tools to compress, convert, edit, merge, split, add OCR, watermark, and optimise your PDF files. No installation required.",
    keywords: [
      "PDF tools", "compress PDF", "convert PDF", "edit PDF", "merge PDF",
      "split PDF", "OCR PDF", "PDF watermark", "PDF security", "PDF online",
      "free PDF tools", "PDF editor", "PDF converter", "PDF compression"
    ],
    authors: [
      { name: "RevisePDF Team" }
    ],
    creator: "RevisePDF",
    publisher: "RevisePDF",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon.png', sizes: '192x192' },
        { url: '/icon-512.png', sizes: '512x512' },
      ],
      apple: { url: '/apple-icon.png', sizes: '180x180' },
    },
    manifest: '/site.webmanifest',
    openGraph: {
      type: 'website',
      locale: locale,
      url: `${baseUrl}/${locale}`,
      siteName: 'RevisePDF',
      title: 'RevisePDF - Free Online PDF Tools',
      description: 'Edit, convert and optimize your PDF files online for free.',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'RevisePDF - PDF Tools Online',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'RevisePDF - Free Online PDF Tools',
      description: 'Edit, convert and optimize your PDF files online for free.',
      images: [`${baseUrl}/twitter-image.png`],
      creator: '@revisepdf',
      site: '@revisepdf',
    },
    verification: {
      google: 'googleVerificationString', // Replace with actual verification string when available
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: routing.locales.reduce((acc: Record<string, string>, cur: string) => {
        acc[cur] = `${baseUrl}/${cur}`;
        return acc;
      }, {}),
    },
    category: 'technology',
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // If the locale doesn't exist, return 404
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        {/* Preconnect to domains used for resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured data for organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "RevisePDF",
              "url": baseUrl,
              "logo": `${baseUrl}/logo.svg`,
              "description": "Free online PDF tools for editing, converting, and optimizing PDF files.",
              "sameAs": [
                "https://twitter.com/revisepdf",
                "https://facebook.com/revisepdf",
                "https://linkedin.com/company/revisepdf"
              ]
            })
          }}
        />

        {/* Additional meta tags for performance and browsers */}
        <meta name="application-name" content="RevisePDF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RevisePDF" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        {/* Save language preference in cookies */}
        <LanguageCookie />

        <NextAuthProvider>
          <AuthProvider>
            <NextIntlClientProvider>
              <div className="min-h-screen flex flex-col">
                {/* Add the AuthStateRefresher component to force refresh of auth state */}
                <AuthStateRefresher />
                <Navbar />
                <div className="flex-grow">
                  <ClientBody>{children}</ClientBody>
                </div>
                <Footer />
              </div>
            </NextIntlClientProvider>
          </AuthProvider>
        </NextAuthProvider>

        {/* Analytics script - uncomment and add your analytics code when ready */}
        {/* <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        /> */}
      </body>
    </html>
  );
}
