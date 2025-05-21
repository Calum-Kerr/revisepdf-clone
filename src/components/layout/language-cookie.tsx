'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { setCookie, getCookie } from '@/lib/cookies';
import { locales, defaultLocale } from '@/i18n';

const LANG_COOKIE_NAME = 'preferred-locale';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export function LanguageCookie() {
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from path
  const getCurrentLocale = (): string => {
    const segment = pathname?.split('/')[1];
    if (segment && locales.includes(segment)) {
      return segment;
    }
    return defaultLocale;
  };

  useEffect(() => {
    // This component only runs on the client side
    if (typeof window === 'undefined') return;

    // Get the current locale from the URL
    const currentLocale = getCurrentLocale();

    // Always set the locale to en-GB for UK users
    if (currentLocale !== 'en-GB') {
      // Set localStorage to en-GB
      try {
        localStorage.setItem(LANG_COOKIE_NAME, 'en-GB');
      } catch (e) {
        console.error('Failed to set localStorage:', e);
      }

      // Set cookie to en-GB
      try {
        setCookie(LANG_COOKIE_NAME, 'en-GB', {
          maxAge: COOKIE_MAX_AGE,
          path: '/',
          sameSite: 'lax',
        });
      } catch (e) {
        console.error('Failed to set cookie:', e);
      }

      // Redirect to en-GB only once
      try {
        if (!sessionStorage.getItem('redirected_to_en_gb') && pathname) {
          // Set a flag to prevent multiple redirects
          sessionStorage.setItem('redirected_to_en_gb', 'true');

          // Replace the locale segment in the path
          const segments = pathname.split('/');
          if (segments.length > 1 && locales.includes(segments[1])) {
            segments[1] = 'en-GB';
          } else {
            segments.splice(1, 0, 'en-GB');
          }
          const newPath = segments.join('/');
          router.push(newPath);
        }
      } catch (e) {
        console.error('Failed to redirect:', e);
      }
    }
  }, [pathname, router]);

  // This component doesn't render anything
  return null;
}

export default LanguageCookie;
