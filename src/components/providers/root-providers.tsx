'use client';

import { AuthProvider } from '@/components/providers/auth-provider.provider';
import { AppThemeProvider } from '@/components/providers/app-theme-provider';
import type { AppLocale } from '@/constants/locales';
import type { IThemeValue } from '@/constants/theme.constants';
import type { Session } from 'next-auth';
import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import type { ReactNode } from 'react';

type RootProvidersProps = {
  children: ReactNode;
  locale: AppLocale;
  messages: AbstractIntlMessages;
  timeZone: string;
  initialTheme: IThemeValue;
  session: Session | null;
};

export function RootProviders({
  children,
  locale,
  messages,
  timeZone,
  initialTheme,
  session,
}: RootProvidersProps) {
  return (
    <AuthProvider session={session}>
      <AppThemeProvider initialTheme={initialTheme}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone={timeZone}
        >
          {children}
        </NextIntlClientProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
}
