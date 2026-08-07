"use client";

import { useLayoutEffect } from "react";
import {
  DEFAULT_THEME,
  type IThemeValue,
  normalizeStoredTheme,
  THEME_STORAGE_KEY,
} from "@/constants/theme.constants";
import { formatClientCookie } from "@/helpers/cookies/format-client-cookie";

const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const readThemeFromCookie = (): IThemeValue | null => {
  const escapedKey = THEME_STORAGE_KEY.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${escapedKey}=([^;]*)`),
  );

  if (!match?.[1]) {
    return null;
  }

  return normalizeStoredTheme(decodeURIComponent(match[1]));
};

const writeThemeCookie = (theme: string): void => {
  document.cookie = formatClientCookie(THEME_STORAGE_KEY, theme, {
    maxAge: THEME_COOKIE_MAX_AGE,
  });
};

/**
 * Keeps hybrid theme storage in sync before ClientThemeProvider reads it.
 * Prefer localStorage (last client choice), then cookie, then default — so a
 * stale SSR cookie cannot wipe a theme that only lived in localStorage.
 */
export const ThemeStorageMigration = (): null => {
  useLayoutEffect(() => {
    const storedTheme =
      normalizeStoredTheme(localStorage.getItem(THEME_STORAGE_KEY)) ??
      readThemeFromCookie() ??
      DEFAULT_THEME;

    writeThemeCookie(storedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, storedTheme);
  }, []);

  return null;
};
