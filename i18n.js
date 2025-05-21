// This is the root i18n configuration file for next-intl
const { getRequestConfig } = require('next-intl/server');

module.exports = getRequestConfig(async ({ locale }) => {
  // If the locale isn't configured, use the default locale
  let messages;
  try {
    messages = require(`./messages/${locale}.json`);
  } catch (error) {
    messages = require('./messages/en.json');
  }

  return {
    messages,
    timeZone: 'UTC'
  };
});
