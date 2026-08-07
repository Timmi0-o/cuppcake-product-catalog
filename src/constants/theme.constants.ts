export const THEME_STORAGE_KEY = 'cuppcake-theme';

export const THEME_LIST = ['light', 'dark'] as const;

export const DEFAULT_THEME = 'light';

export const THEME_COLORS = {
  light: '#f7f9f7',
  dark: '#121512',
} as const satisfies Record<(typeof THEME_LIST)[number], string>;

export type IThemeValue = (typeof THEME_LIST)[number];

export function isStoredTheme(value: string): value is IThemeValue {
  return THEME_LIST.includes(value as IThemeValue);
}
