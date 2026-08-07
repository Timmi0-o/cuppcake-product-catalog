export const LOCALES = {
  en: 'en',
  ru: 'ru',
} as const;

export type AppLocale = (typeof LOCALES)[keyof typeof LOCALES];

export const LOCALE_OPTIONS: ReadonlyArray<{
  locale: AppLocale;
  label: string;
}> = [
  { locale: LOCALES.ru, label: 'Русский' },
  { locale: LOCALES.en, label: 'English' },
];

export const INTL_LOCALES: Record<AppLocale, string> = {
  en: 'en-US',
  ru: 'ru-RU',
};

export const isAppLocale = (value: string): value is AppLocale =>
  Object.values(LOCALES).includes(value as AppLocale);
