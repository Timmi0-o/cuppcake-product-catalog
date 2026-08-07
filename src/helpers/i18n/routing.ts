import { LOCALES, type AppLocale } from '@/constants/locales';
import {
  LOCALE_COOKIE_KEY,
  LOCALE_COOKIE_MAX_AGE,
} from '@/constants/locale-cookie.constants';
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

const localeList = Object.values(LOCALES) as AppLocale[];

export const routing = defineRouting({
  locales: localeList,
  defaultLocale: LOCALES.ru,
  localePrefix: 'never',
  localeDetection: true,
  localeCookie: {
    name: LOCALE_COOKIE_KEY,
    maxAge: LOCALE_COOKIE_MAX_AGE,
  },
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
