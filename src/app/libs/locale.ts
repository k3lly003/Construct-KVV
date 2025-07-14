import { defaultLocale, locales, type Locale } from '../i18n/config';

export const getUserLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  // Try to get locale from localStorage
  const storedLocale = localStorage.getItem('locale') as Locale;
  if (storedLocale && locales.includes(storedLocale)) {
    return storedLocale;
  }

  // Try to get locale from browser
  const browserLocale = navigator.language.split('-')[0] as Locale;
  if (browserLocale && locales.includes(browserLocale)) {
    return browserLocale;
  }

  return defaultLocale;
};

export const setUserLocale = (locale: Locale): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale);
  }
}; 