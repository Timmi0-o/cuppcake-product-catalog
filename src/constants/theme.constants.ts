export const THEME_STORAGE_KEY = "cuppcake-theme";

export const THEME_LIST = ["light", "dark"] as const;

export const DEFAULT_THEME = "light";

export const THEME_COLORS = {
  light: "#f7f9f7",
  dark: "#121512",
} as const satisfies Record<(typeof THEME_LIST)[number], string>;

/** Matches `--foreground` — used by pre-hydration anti-flash styles */
export const THEME_FOREGROUND_COLORS = {
  light: "oklch(0.22 0.02 145)",
  dark: "oklch(0.93 0.01 145)",
} as const satisfies Record<(typeof THEME_LIST)[number], string>;

export type IThemeValue = (typeof THEME_LIST)[number];

export function isStoredTheme(value: string): value is IThemeValue {
  return THEME_LIST.includes(value as IThemeValue);
}

export function normalizeStoredTheme(
  rawValue: string | null,
): IThemeValue | null {
  if (!rawValue) {
    return null;
  }

  const NORMALIZED_VALUE = rawValue.replace(/^"|"$/g, "");

  return isStoredTheme(NORMALIZED_VALUE) ? NORMALIZED_VALUE : null;
}
