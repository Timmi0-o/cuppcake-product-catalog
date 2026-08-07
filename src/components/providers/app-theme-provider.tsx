'use client';

import {
  DEFAULT_THEME,
  THEME_LIST,
  THEME_STORAGE_KEY,
  type IThemeValue,
} from '@/constants/theme.constants';
import { ClientThemeProvider } from '@wrksz/themes/client';
import type { ReactNode } from 'react';

type AppThemeProviderProps = {
  children: ReactNode;
  initialTheme: IThemeValue;
};

export function AppThemeProvider({
  children,
  initialTheme,
}: AppThemeProviderProps) {
  return (
    <ClientThemeProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      storageKey={THEME_STORAGE_KEY}
      themes={[...THEME_LIST]}
      enableSystem={false}
      storage="hybrid"
      initialTheme={initialTheme}
      disableTransitionOnChange
    >
      {children}
    </ClientThemeProvider>
  );
}
