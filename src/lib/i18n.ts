import { notFound } from 'next/navigation';
import { createIntl } from '@formatjs/intl';
import { getRequestConfig } from 'next-intl/server';

// Supported languages with their native names
export const locales = ['en', 'es', 'fr', 'de', 'pt-BR', 'hi', 'ru', 'ko', 'vi', 'en-CA', 'es-MX', 'en-GB'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  'pt-BR': 'Português (Brasil)',
  hi: 'हिन्दी',
  ru: 'Русский',
  ko: '한국어',
  vi: 'Tiếng Việt',
  'en-CA': 'English (Canada)',
  'es-MX': 'Español (México)',
  'en-GB': 'English (UK)',
};

// Default language/fallback
export const defaultLocale: Locale = 'en-GB';

// Get supported locales for sitemap and other meta
export function getSupportedLocales() {
  return locales;
}

// Get messages for a specific locale
export async function getMessages(locale: string = defaultLocale) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale "${locale}"`, error);
    return (await import(`../../messages/${defaultLocale}.json`)).default;
  }
}

// Create intl instance
export async function createIntlInstance(locale: string) {
  const messages = await getMessages(locale);
  return createIntl({
    locale,
    messages,
  });
}

// Next-intl configuration for middleware and Next.js LayoutProps compatibility
export async function localeConfig({ locale }: { locale: string }) {
  // Validate that the incoming locale is supported
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return getRequestConfig({
    locale,
    messages: await getMessages(locale),
  });
}

// Helper function to format dates according to the locale
export function formatDate(
  locale: string,
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
) {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

// Helper function to get current locale from pathname
export function getLocaleFromPathname(pathname: string): Locale {
  // Get the first path segment
  const segment = pathname.split('/')[1];

  // Check if it's a valid locale
  if (locales.includes(segment as Locale)) {
    return segment as Locale;
  }

  return defaultLocale;
}
