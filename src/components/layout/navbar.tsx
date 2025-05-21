"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X, Globe, MapPin, Check } from "lucide-react";
import UserMenu from "@/components/auth/user-menu";
import { localeNames, locales, defaultLocale } from "@/i18n";

// Component to display country/region flag or globe icon
const LocaleIcon = ({ locale }: { locale: string }) => {
  // Map locale to country code for flag emoji
  const getCountryCode = () => {
    if (locale.includes('-')) {
      return locale.split('-')[1];
    }

    // Map language to default country
    const langToCountry: Record<string, string> = {
      en: 'GB',
      es: 'ES',
      fr: 'FR',
      de: 'DE',
      pt: 'BR',
      hi: 'IN',
      ru: 'RU',
      ko: 'KR',
      vi: 'VN'
    };

    return langToCountry[locale] || 'UN'; // UN for unknown
  };

  return (
    <span className="inline-flex items-center justify-center mr-2">
      {locale.includes('-') ? (
        <MapPin className="h-4 w-4" />
      ) : (
        <Globe className="h-4 w-4" />
      )}
    </span>
  );
};

export const Navbar = () => {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  // Get current pathname and router
  const pathname = usePathname();
  const router = useRouter();

  // Extract current locale from pathname
  const getCurrentLocale = () => {
    const segments = pathname.split('/');
    // First segment after empty string (which comes from split on leading /)
    const segment = segments[1];

    // Check if it's a locale
    if (locales.includes(segment)) {
      return segment;
    }

    return defaultLocale;
  };

  const currentLocale = getCurrentLocale();

  const toggleMegaMenu = () => {
    setMegaMenuOpen(!megaMenuOpen);
    // Close mobile menu if open
    if (mobileMenuOpen) setMobileMenuOpen(false);
    // Close language menu if open
    if (languageMenuOpen) setLanguageMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Close mega menu if open
    if (megaMenuOpen) setMegaMenuOpen(false);
    // Close language menu if open
    if (languageMenuOpen) setLanguageMenuOpen(false);
    // Close mobile tools if closing menu
    if (mobileMenuOpen) setMobileToolsOpen(false);
  };

  const toggleMobileTools = () => {
    setMobileToolsOpen((prev) => !prev);
  };

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
    // Close mega menu if open
    if (megaMenuOpen) setMegaMenuOpen(false);
    // Close mobile tools if open
    if (mobileToolsOpen) setMobileToolsOpen(false);
  };

  const handleLanguageChange = (locale: string) => {
    // Get the path without the locale
    const segments = pathname.split('/');

    // If the first segment is a locale, remove it
    if (locales.includes(segments[1])) {
      segments.splice(1, 1);
    }

    // Add the new locale
    segments.splice(1, 0, locale);

    // Construct the new path
    const newPath = segments.join('/');

    // Navigate to the new path
    router.push(newPath);

    // Save preference to localStorage
    try {
      localStorage.setItem('preferred-locale', locale);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }

    setLanguageMenuOpen(false);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  // Group languages by region for better UX in the dropdown
  const groupedLocales = {
    global: locales.filter(l => !l.includes('-')),
    regional: locales.filter(l => l.includes('-'))
  };

  // Tool categories for rendering (static English labels for now)
  const toolCategories = [
    {
      title: "Convert to PDF",
      links: [
        { href: `/${currentLocale}/convert-to-pdf/image-to-pdf`, label: "Image to PDF" },
        { href: `/${currentLocale}/convert-to-pdf/office-to-pdf`, label: "Office to PDF" },
        { href: `/${currentLocale}/convert-to-pdf/html-to-pdf`, label: "HTML to PDF" },
        { href: `/${currentLocale}/convert-to-pdf/zip-to-pdf`, label: "ZIP to PDF" },
      ],
    },
    {
      title: "Convert from PDF",
      links: [
        { href: `/${currentLocale}/convert-from-pdf/pdf-to-image`, label: "PDF to Image" },
        { href: `/${currentLocale}/convert-from-pdf/pdf-to-panoramic`, label: "PDF to Panoramic" },
        { href: `/${currentLocale}/convert-from-pdf/pdf-to-pdfa`, label: "PDF to PDF/A" },
      ],
    },
    {
      title: "Optimise",
      links: [
        { href: `/${currentLocale}/optimise/compress`, label: "Compress PDF" },
        { href: `/${currentLocale}/optimise/repair`, label: "Repair PDF" },
        { href: `/${currentLocale}/optimise/ocr`, label: "OCR PDF" },
      ],
    },
    {
      title: "Edit",
      links: [
        { href: `/${currentLocale}/edit/page-numbers`, label: "Add Page Numbers" },
        { href: `/${currentLocale}/edit/watermark`, label: "Add Watermark" },
        { href: `/${currentLocale}/edit/content`, label: "Edit Content" },
        { href: `/${currentLocale}/edit/text-editor`, label: "Edit Text" },
        { href: `/${currentLocale}/edit/signature`, label: "Add Signature" },
      ],
    },
    {
      title: "Organise",
      links: [
        { href: `/${currentLocale}/organise/merge`, label: "Merge PDFs" },
        { href: `/${currentLocale}/organise/split`, label: "Split PDF" },
        { href: `/${currentLocale}/organise/extract`, label: "Extract Pages" },
        { href: `/${currentLocale}/organise/rotate`, label: "Rotate Pages" },
      ],
    },
    {
      title: "Security",
      links: [
        { href: `/${currentLocale}/security/unlock`, label: "Unlock PDF" },
        { href: `/${currentLocale}/security/protect`, label: "Protect PDF" },
        { href: `/${currentLocale}/security/redact`, label: "Redact PDF" },
        { href: `/${currentLocale}/security/flatten`, label: "Flatten PDF" },
      ],
    },
  ];

  return (
    <header className="relative z-50">
      <nav className="bg-white border-b">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href={`/${currentLocale}`} className="flex items-center">
              <Image
                src="/logo.svg"
                alt="RevisePDF"
                width={140}
                height={28}
                priority
                className="w-28 md:w-40"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleMegaMenu}
              className="flex items-center text-gray-700 hover:text-[#238287]"
            >
              <span className="mr-1">All PDF Tools</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  megaMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center text-gray-700 hover:text-[#238287]"
              >
                <LocaleIcon locale={currentLocale} />
                <span>{localeNames[currentLocale]}</span>
                <ChevronDown
                  className={`h-4 w-4 ml-1 transition-transform ${
                    languageMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Language dropdown */}
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                  <div className="py-1 max-h-80 overflow-y-auto">
                    {/* Global languages */}
                    {groupedLocales.global.length > 0 && (
                      <div>
                        <div className="px-4 py-1 text-xs text-gray-400 uppercase">
                          Languages
                        </div>
                        {groupedLocales.global.map((locale: string) => (
                          <button
                            key={locale}
                            className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                              locale === currentLocale
                                ? "bg-gray-100 text-[#238287] font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => handleLanguageChange(locale)}
                          >
                            <LocaleIcon locale={locale} />
                            <span className="flex-1">{localeNames[locale]}</span>
                            {locale === currentLocale && (
                              <Check className="h-4 w-4 text-[#238287] ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Regional languages */}
                    {groupedLocales.regional.length > 0 && (
                      <div>
                        <div className="px-4 py-1 text-xs text-gray-400 uppercase">
                          Regional
                        </div>
                        {groupedLocales.regional.map((locale: string) => (
                          <button
                            key={locale}
                            className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                              locale === currentLocale
                                ? "bg-gray-100 text-[#238287] font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => handleLanguageChange(locale)}
                          >
                            <LocaleIcon locale={locale} />
                            <span className="flex-1">{localeNames[locale]}</span>
                            {locale === currentLocale && (
                              <Check className="h-4 w-4 text-[#238287] ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile language switcher */}
            <button
              onClick={toggleLanguageMenu}
              className="p-2 text-gray-700 hover:text-[#238287]"
              aria-label="Change language"
            >
              <LocaleIcon locale={currentLocale} />
            </button>

            <UserMenu />
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-[#238287]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile language menu */}
      {languageMenuOpen && mobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-md">
          <div className="container py-2">
            <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {locales.map((locale: string) => (
                <button
                  key={locale}
                  className={`flex items-center py-2 px-3 text-sm rounded w-full ${
                    locale === currentLocale
                      ? "bg-gray-100 text-[#238287] font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handleLanguageChange(locale)}
                >
                  <LocaleIcon locale={locale} />
                  <span className="flex-1">{localeNames[locale]}</span>
                  {locale === currentLocale && (
                    <Check className="h-4 w-4 text-[#238287] ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-md">
          <div className="container py-2">
            <button
              onClick={toggleMobileTools}
              className="flex items-center w-full py-2 px-3 text-gray-700 hover:text-[#238287] hover:bg-gray-50 rounded"
            >
              <span className="flex-1 text-left text-sm">All PDF Tools</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  mobileToolsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {/* Mobile tools dropdown */}
            {mobileToolsOpen && (
              <div className="mt-2 pb-2">
                <div className="grid grid-cols-1 gap-4">
                  {toolCategories.map((cat) => (
                    <div key={cat.title}>
                      <div className="font-medium text-xs uppercase text-gray-500 mb-1 px-3">
                        {cat.title}
                      </div>
                      <div className="flex flex-col space-y-1">
                        {cat.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-gray-700 hover:text-[#238287] px-5 py-1"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mega Menu */}
      {megaMenuOpen && (
        <div className="absolute w-full bg-white shadow-lg border-t border-gray-200 z-20">
          <div className="container py-4 md:py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {toolCategories.map((cat) => (
                <div className="col-span-1" key={cat.title}>
                  <div className="font-medium text-xs uppercase text-gray-500 mb-2">
                    {cat.title}
                  </div>
                  <div className="flex flex-col space-y-1">
                    {cat.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm text-gray-700 hover:text-[#238287]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
