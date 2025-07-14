import { getUserLocale } from '../libs/locale';

export const getRequestConfig = async () => {
  const userLocale = getUserLocale();
  return {
    locale: userLocale,
    messages: (await import(`../messages/${userLocale}.json`)).default,
  };
};