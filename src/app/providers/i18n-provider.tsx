'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { getUserLocale } from '../libs/locale';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [i18nInstance, setI18nInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        // Dynamic import to avoid server-side issues
        const { default: i18n } = await import('../i18n/i18n');
        const userLocale = getUserLocale();
        
        if (i18n.language !== userLocale) {
          i18n.changeLanguage(userLocale);
        }
        
        setI18nInstance(i18n);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeI18n();
  }, []);

  if (isLoading || !i18nInstance) {
    return <div>{children}</div>; // Render children without i18n while loading
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  );
} 