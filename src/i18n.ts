import { isAppLocale, type AppLocale } from '@/constants/locales';
import { messagesByLocale } from '@/generated/i18n/messages.generated';
import { routing } from '@/helpers/i18n/routing';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale: AppLocale =
    requestedLocale && isAppLocale(requestedLocale)
      ? requestedLocale
      : routing.defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale] ?? {},
    timeZone: 'Europe/Moscow',
  };
});
