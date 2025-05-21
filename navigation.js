/**
 * Centralized routing configuration for internationalization and navigation.
 */
module.exports = {
  // Default locale
  defaultLocale: 'en-GB',

  // Supported languages - must match the JSON files in messages/ folder
  locales: ['en-GB', 'en', 'es', 'fr', 'de', 'pt-BR', 'hi', 'ru', 'ko', 'vi', 'en-CA', 'es-MX'],

  // Locale display names for UI
  localeNames: {
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
  },

  // Country codes for browser language detection mapping
  countryLocaleMap: {
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
  }
};
