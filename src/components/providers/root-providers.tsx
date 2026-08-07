"use client";

import type { Session } from "next-auth";
import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { AppThemeProvider } from "@/components/providers/app-theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider.provider";
import { QueryClientProviderWrapper } from "@/components/providers/query-client.provider";
import { ThemeStorageMigration } from "@/components/providers/theme-storage-migration";
import { Toaster } from "@/components/shared/ui/sonner";
import type { AppLocale } from "@/constants/locales";

type RootProvidersProps = {
  children: ReactNode;
  locale: AppLocale;
  messages: AbstractIntlMessages;
  timeZone: string;
  session: Session | null;
  cookieOptions?: {
    domain?: string;
  };
};

export function RootProviders({
  children,
  locale,
  messages,
  timeZone,
  session,
  cookieOptions,
}: RootProvidersProps) {
  return (
    <AppThemeProvider cookieOptions={cookieOptions}>
      <ThemeStorageMigration />
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
      >
        <AuthProvider session={session}>
          <QueryClientProviderWrapper>
            {children}
            <Toaster />
          </QueryClientProviderWrapper>
        </AuthProvider>
      </NextIntlClientProvider>
    </AppThemeProvider>
  );
}
