'use client';

import { useTranslation } from 'react-i18next';
import { locales, localeNames, type Locale } from '@/app/i18n/config';
import { setUserLocale } from '@/app/libs/locale';
import Button from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LanguageSwitcher() {
  const { i18n, t, ready } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    if (isClient && ready) {
      i18n.changeLanguage(locale);
      setUserLocale(locale);
    }
  };

  // Don't render until client-side and i18n is ready
  if (!isClient || !ready) {
    return (
      <Button
        text="Language"
        texSize="text-sm"
        hoverBg="hover:bg-gray-200"
        borderCol="border-gray-300"
        bgCol="bg-white"
        textCol="text-black"
        border="border"
        padding="px-4 py-2"
        round="rounded"
        handleButton={() => {/* your handler */}}
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          text={t('common.language')}
          texSize="text-sm"
          hoverBg="hover:bg-gray-200"
          borderCol="border-gray-300"
          bgCol="bg-white"
          textCol="text-black"
          border="border"
          padding="px-4 py-2"
          round="rounded"
          handleButton={() => {}}
          icon={<Globe className="h-4 w-4" />}
          className="gap-2"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={i18n.language === locale ? 'bg-accent' : ''}
          >
            {localeNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 