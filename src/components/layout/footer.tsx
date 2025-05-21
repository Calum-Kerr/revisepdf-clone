import React from "react";
import { Locale, getMessages, formatDate } from "@/lib/i18n";
import FooterClient from "./footer-client";

interface FooterProps {
  locale: Locale;
}

export async function Footer({ locale }: FooterProps) {
  // Get translations for the component
  const messages = await getMessages(locale);
  const footerText = messages.footer || {
    company: {
      title: "RevisePDF",
      description: "A comprehensive suite of PDF processing tools.",
      location: "Edinburgh, Scotland",
      email: "Email: {email}"
    },
    blog: {
      title: "PDF Blog",
      all_articles: "All Articles",
      tools_for_students: "PDF Tools for Students",
      compression_guide: "PDF Compression Guide",
      ocr_tech: "OCR Technology"
    },
    legal: {
      title: "Legal",
      privacy_policy: "Privacy Policy",
      terms_of_service: "Terms of Service",
      cookie_policy: "Cookie Policy",
      gdpr: "GDPR Compliance",
      accessibility: "Accessibility Statement",
      data_protection: "Data Protection",
      security: "Security Information"
    },
    account: {
      title: "Account",
      login: "Log In",
      register: "Register"
    },
    copyright: "© {year} RevisePDF. Last updated: {date}. All rights reserved."
  };

  // Format copyright with current year and formatted date
  const today = new Date();
  const formattedDate = formatDate(locale, today, { day: "2-digit", month: "2-digit", year: "numeric" });
  const copyright = footerText.copyright
    .replace("{year}", "2025")
    .replace("{date}", "21/05/2025");

  return <FooterClient locale={locale} footerText={footerText} copyright={copyright} />;
}

export default Footer;
