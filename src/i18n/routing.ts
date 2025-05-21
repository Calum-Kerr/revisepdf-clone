import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en-GB', 'en', 'es', 'fr', 'de', 'pt-BR', 'hi', 'ru', 'ko', 'vi', 'en-CA', 'es-MX'],

  // Used when no locale matches
  defaultLocale: 'en-GB'
});
