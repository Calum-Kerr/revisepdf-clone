import { getRequestConfig } from 'next-intl/server';
import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from '@/i18n';

export default getRequestConfig(async ({ locale }) => {
  // Make sure locale is one of the supported locales
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale, // Explicitly return the locale
    timeZone: 'UTC',
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

// Create the navigation helpers for linking between localized pages
// For Next.js App Router with i18n
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
  pathnames: {
    '/': '/',
    '/optimise/compress': '/optimise/compress',
    '/downloads': '/downloads',
    '/profile': '/profile'
    // Add other routes as needed
  }
});
