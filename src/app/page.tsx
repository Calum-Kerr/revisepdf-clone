import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { defaultLocale, locales } from '@/i18n';

export default function Home() {
  // Try to get locale from cookies first
  const cookieStore = cookies();
  const preferredLocale = cookieStore.get('preferred-locale')?.value;

  // Use preferred locale if it exists and is valid, otherwise use default locale
  const targetLocale = preferredLocale && locales.includes(preferredLocale)
    ? preferredLocale
    : defaultLocale;

  // Redirect to localized homepage
  redirect(`/${targetLocale}`);

  // This won't be rendered, but is needed for TypeScript
  return null;
}
