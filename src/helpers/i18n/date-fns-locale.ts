import type { AppLocale } from '@/constants/locales';
import type { Locale } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

const DATE_FNS_LOCALES: Record<AppLocale, Locale> = {
  en: enUS,
  ru,
};

export const getDateFnsLocale = (locale: AppLocale): Locale =>
  DATE_FNS_LOCALES[locale] ?? enUS;
