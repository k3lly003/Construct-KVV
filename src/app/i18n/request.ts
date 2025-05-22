// import { getUserLocale } from '../libs/locale';
// import { getRequestConfig } from 'next-intl/server';

// export default getRequestConfig(async () => {
//   const userLocale = getUserLocale();
//   return {
//     locale: userLocale,
//     messages: (await import(`../messages/${userLocale}.json`)).default,
//   };
// });