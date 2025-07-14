import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultLocale, locales } from './config';

// Import translation files
import enTranslations from '../messages/en.json';
import frTranslations from '../messages/fr.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  fr: {
    translation: frTranslations,
  },
};

// Only initialize if not already initialized
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLocale, // Start with default locale
      fallbackLng: defaultLocale,
      supportedLngs: locales,
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      react: {
        useSuspense: false, // Disable Suspense for better SSR compatibility
      },
      // Disable debug in production
      debug: process.env.NODE_ENV === 'development',
    });
}

export default i18n; 