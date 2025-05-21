"use client";

import Link from "next/link";
import React from "react";
import { Mail, MapPin } from "lucide-react";
import AuthLinks from "@/components/auth/auth-links";

import { Locale } from "@/lib/i18n";

interface FooterClientProps {
  locale: Locale;
  footerText: any;
  copyright: string;
}

export default function FooterClient({ locale, footerText, copyright }: FooterClientProps) {

  return (
    <footer className="bg-[#238287] py-8 mt-10 text-white">
      <div className="container">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{footerText.company.title}</h3>
            <p className="text-sm text-white/90">{footerText.company.description}</p>
            <div className="flex items-start space-x-2 text-sm text-white/90">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{footerText.company.location}</span>
            </div>
            <div className="flex items-start space-x-2 text-sm text-white/90">
              <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <a
                href="mailto:calum@revisepdf.com"
                className="hover:text-white hover:underline transition-colors"
              >
                calum@revisepdf.com
              </a>
            </div>
          </div>

          {/* PDF Blog */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{footerText.blog.title}</h3>
            <ul className="space-y-2">
              {[
                { label: footerText.blog.all_articles, href: `/${locale}/blog` },
                { label: footerText.blog.tools_for_students, href: `/${locale}/blog/best-pdf-tools-for-students` },
                { label: footerText.blog.compression_guide, href: `/${locale}/blog/how-to-compress-pdf-without-losing-quality` },
                { label: footerText.blog.ocr_tech, href: `/${locale}/blog/ocr-technology-explained` }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/90 hover:text-white hover:underline transition-colors flex items-center"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{footerText.legal.title}</h3>
            <div className="grid grid-cols-1 xs:grid-cols-1 gap-2">
              {[
                { label: footerText.legal.privacy_policy, href: `/${locale}/privacy-policy` },
                { label: footerText.legal.terms_of_service, href: `/${locale}/terms-of-service` },
                { label: footerText.legal.cookie_policy, href: `/${locale}/cookie-policy` },
                { label: footerText.legal.gdpr, href: `/${locale}/gdpr-compliance` },
                { label: footerText.legal.accessibility, href: `/${locale}/accessibility-statement` },
                { label: footerText.legal.data_protection, href: `/${locale}/data-protection` },
                { label: footerText.legal.security, href: `/${locale}/security-information` }
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-sm text-white/90 hover:text-white hover:underline transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account Section - Conditional based on authentication */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{footerText.account.title}</h3>
            <div className="flex flex-col space-y-2">
              <AuthLinks
                locale="en-GB"
                variant="footer"
                loginText={footerText.account.login}
                registerText={footerText.account.register}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/80 mb-4 md:mb-0">{copyright}</p>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com/revisepdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/revisepdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="https://github.com/revisepdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
