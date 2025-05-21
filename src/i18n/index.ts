import { notFound } from 'next/navigation';
import { createIntl } from '@formatjs/intl';

// Import from root navigation config
const { locales, defaultLocale } = require('../../navigation');

// TypeScript support for our locale types
export type Locale = typeof locales[number];

// Locale names for UI display
export const localeNames: Record<string, string> = {
  'en-GB': 'English (UK)',
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
};

// Re-export for convenience
export { locales, defaultLocale };

// Country codes for browser language detection mapping
export const countryLocaleMap: Record<string, string> = {
  US: 'en',
  GB: 'en-GB',
  UK: 'en-GB', // Additional mapping for United Kingdom
  CA: 'en-CA',
  ES: 'es',
  MX: 'es-MX',
  FR: 'fr',
  DE: 'de',
  AT: 'de',
  BR: 'pt-BR',
  PT: 'pt-BR',
  IN: 'hi',
  RU: 'ru',
  KR: 'ko',
  VN: 'vi',
  // Add Scotland specifically
  SCT: 'en-GB'
};

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
export function getLocaleFromPathname(pathname: string): string {
  // Get the first path segment
  const segment = pathname.split('/')[1];

  // Check if it's a valid locale
  if (locales.includes(segment)) {
    return segment;
  }

  return defaultLocale;
}

// Helper to detect browser language and map to supported locale
export function getBrowserLocale(acceptLanguage: string): string {
  if (!acceptLanguage) return defaultLocale;

  // Parse the Accept-Language header
  const languages = acceptLanguage.split(',').map(lang => {
    const [langCode, weight] = lang.trim().split(';q=');
    return {
      code: langCode,
      weight: weight ? parseFloat(weight) : 1.0
    };
  }).sort((a, b) => b.weight - a.weight);

  // Extract language and country from first preferred language
  const preferred = languages[0]?.code || '';
  const [language, country] = preferred.split('-');

  // First try exact match
  if (locales.includes(preferred)) {
    return preferred;
  }

  // Then try country-specific match
  if (country && countryLocaleMap[country.toUpperCase()]) {
    return countryLocaleMap[country.toUpperCase()];
  }

  // Then try language match
  for (const locale of locales) {
    const localeLanguage = locale.split('-')[0];
    if (localeLanguage === language.toLowerCase()) {
      return locale;
    }
  }

  return defaultLocale;
}
