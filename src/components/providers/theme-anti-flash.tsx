import { ThemeScript } from "@wrksz/themes/script";
import {
  DEFAULT_THEME,
  type IThemeValue,
  THEME_COLORS,
  THEME_FOREGROUND_COLORS,
  THEME_LIST,
  THEME_STORAGE_KEY,
} from "@/constants/theme.constants";

type ThemeAntiFlashProps = {
  theme: IThemeValue;
};

/**
 * Blocks white FOUC before React hydrates:
 * 1) ThemeScript applies class from hybrid storage before first paint
 * 2) Inline CSS locks background/color to the SSR theme until CSS loads
 */
export function ThemeAntiFlash({ theme }: ThemeAntiFlashProps) {
  return (
    <>
      <ThemeScript
        attribute="class"
        defaultTheme={DEFAULT_THEME}
        storageKey={THEME_STORAGE_KEY}
        themes={[...THEME_LIST]}
        enableSystem={false}
        storage="hybrid"
        disableTransitionOnChange
        themeColor={THEME_COLORS}
      />
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: critical FOUC CSS from trusted theme tokens
        dangerouslySetInnerHTML={{
          __html: `html,html body{background-color:${THEME_COLORS[theme]};color:${THEME_FOREGROUND_COLORS[theme]}}html.dark,html.dark body{background-color:${THEME_COLORS.dark};color:${THEME_FOREGROUND_COLORS.dark}}`,
        }}
      />
    </>
  );
}
