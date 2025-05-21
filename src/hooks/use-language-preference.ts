'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getLocaleFromPathname } from '@/i18n';
import { Locale, locales, defaultLocale, countryLocaleMap } from '@/i18n';

interface LanguagePreference {
  locale: Locale;
  savedLocale: Locale | null;
  detectedLocale: Locale | null;
  detectedCountry: string | null;
  isDetecting: boolean;
  setLocale: (locale: Locale) => void;
  resetToDetected: () => void;
  resetToDefault: () => void;
}

export function useLanguagePreference(): LanguagePreference {
  const pathname = usePathname();
  const router = useRouter();
  const [savedLocale, setSavedLocale] = useState<Locale | null>(null);
  const [detectedLocale, setDetectedLocale] = useState<Locale | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);

  // Get current locale from URL
  const currentLocale = getLocaleFromPathname(pathname) as Locale;

  useEffect(() => {
    const detectLanguage = async () => {
      setIsDetecting(true);

      try {
        // First try to get from localStorage
        const storedLocale = localStorage.getItem('preferred-locale');
        if (storedLocale && locales.includes(storedLocale as Locale)) {
          setSavedLocale(storedLocale as Locale);
        }

        // Detect browser language
        const browserLang = window.navigator.language;
        const [language, country] = browserLang.split('-');

        // Try to determine country for better localization
        let detectedCountryCode: string | null = country || null;

        // If country not available from browser language, try to get from geolocation API
        if (!detectedCountryCode) {
          try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data && data.country) {
              detectedCountryCode = data.country;
              setDetectedCountry(data.country_name || data.country);
            }
          } catch (error) {
            console.error('Failed to get country from geolocation API:', error);
          }
        } else {
          try {
            setDetectedCountry(
              new Intl.DisplayNames([browserLang], { type: 'region' }).of(detectedCountryCode) ||
                detectedCountryCode
            );
          } catch {
            setDetectedCountry(detectedCountryCode);
          }
        }

        // Find the most appropriate locale based on browser language and country
        // Default to British English for UK users
        let bestMatchLocale: Locale = 'en-GB';

        // For UK/GB users, always use en-GB
        if (detectedCountryCode &&
            (detectedCountryCode.toUpperCase() === 'GB' ||
             detectedCountryCode.toUpperCase() === 'UK' ||
             detectedCountryCode.toUpperCase() === 'SCT')) {
          bestMatchLocale = 'en-GB';
        }
        // First try exact match with browser language
        else if (locales.includes(browserLang as Locale)) {
          bestMatchLocale = browserLang as Locale;
        }
        // Then try country-specific match
        else if (detectedCountryCode && countryLocaleMap[detectedCountryCode.toUpperCase()]) {
          bestMatchLocale = countryLocaleMap[detectedCountryCode.toUpperCase()] as Locale;
        }
        // Then try language match
        else {
          for (const locale of locales) {
            if (locale.split('-')[0] === language) {
              bestMatchLocale = locale as Locale;
              break;
            }
          }
        }

        setDetectedLocale(bestMatchLocale);

        // If no saved preference, use detected locale
        if (!storedLocale) {
          setSavedLocale(bestMatchLocale);
          localStorage.setItem('preferred-locale', bestMatchLocale);
        }
      } catch (error) {
        console.error('Error detecting language:', error);
      } finally {
        setIsDetecting(false);
      }
    };

    detectLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to change locale
  const setLocale = (newLocale: Locale) => {
    if (!locales.includes(newLocale)) return;

    // Save to localStorage
    localStorage.setItem('preferred-locale', newLocale);
    setSavedLocale(newLocale);

    // If current URL doesn't match the new locale, navigate to the new URL
    if (currentLocale !== newLocale) {
      // Replace the locale segment in the pathname
      const segments = pathname.split('/');
      if (segments[1] && locales.includes(segments[1] as Locale)) {
        segments[1] = newLocale;
      } else {
        segments.splice(1, 0, newLocale);
      }
      const newPath = segments.join('/');
      router.push(newPath);
    }
  };

  // Reset to detected locale
  const resetToDetected = () => {
    if (detectedLocale) {
      setLocale(detectedLocale);
    }
  };

  // Reset to default locale
  const resetToDefault = () => {
    setLocale(defaultLocale);
  };

  return {
    locale: currentLocale,
    savedLocale,
    detectedLocale,
    detectedCountry,
    isDetecting,
    setLocale,
    resetToDetected,
    resetToDefault,
  };
}
