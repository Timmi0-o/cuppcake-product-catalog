'use client';

import { useTheme } from '@wrksz/themes/client';
import { useTranslations } from 'next-intl';

export function useGetThemeSettingsByCurrentTheme() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useTranslations('ui.theme');

  const toggleTheme = (): void => {
    if (theme === 'light') {
      setTheme('dark');
      return;
    }

    setTheme('light');
  };

  const getLabel = (): string => {
    switch (theme) {
      case 'dark':
        return t('dark');
      case 'light':
      default:
        return t('light');
    }
  };

  return {
    toggleTheme,
    getLabel,
    resolvedTheme,
    t,
  };
}
