"use client";

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { setUserLocale } from '../libs/locale';

export const useTranslations = () => {
  const { t, i18n, ready } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const changeLanguage = (language: string) => {
    if (isClient) {
      i18n.changeLanguage(language);
      setUserLocale(language as 'en' | 'fr');
    }
  };

  const currentLanguage = isClient ? i18n.language : 'en';

  return {
    t,
    changeLanguage,
    currentLanguage,
    isReady: ready && isClient,
    isClient,
  };
}; 