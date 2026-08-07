'use client';

import { AppThemeProvider } from '@/components/providers/app-theme-provider';
import type { AppLocale } from '@/constants/locales';
import type { IThemeValue } from '@/constants/theme.constants';
import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import type { ReactNode } from 'react';

type RootProvidersProps = {
  children: ReactNode;
  locale: AppLocale;
  messages: AbstractIntlMessages;
  timeZone: string;
  initialTheme: IThemeValue;
};

export function RootProviders({
  children,
  locale,
  messages,
  timeZone,
  initialTheme,
}: RootProvidersProps) {
  return (
    <AppThemeProvider initialTheme={initialTheme}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
      >
        {children}
      </NextIntlClientProvider>
    </AppThemeProvider>
  );
}
