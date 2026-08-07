"use client";

import { ClientThemeProvider } from "@wrksz/themes/client";
import type { ReactNode } from "react";
import {
  DEFAULT_THEME,
  THEME_LIST,
  THEME_STORAGE_KEY,
} from "@/constants/theme.constants";

type AppThemeProviderProps = {
  children: ReactNode;
  cookieOptions?: {
    domain?: string;
  };
};

export function AppThemeProvider({
  children,
  cookieOptions,
}: AppThemeProviderProps) {
  return (
    <ClientThemeProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      storageKey={THEME_STORAGE_KEY}
      themes={[...THEME_LIST]}
      enableSystem={false}
      storage="hybrid"
      disableTransitionOnChange
      cookieOptions={cookieOptions}
    >
      {children}
    </ClientThemeProvider>
  );
}
