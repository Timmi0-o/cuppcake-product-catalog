'use client';

import { useGetThemeSettingsByCurrentTheme } from '@/components/widgets/theme-toggle/hooks/use-get-theme-settings-by-current-theme';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { toggleTheme, resolvedTheme, t } =
    useGetThemeSettingsByCurrentTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !resolvedTheme) {
    return (
      <button
        type="button"
        aria-hidden
        disabled
        className={cn(
          'inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground opacity-60',
          className,
        )}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t('switchToLight') : t('switchToDark')}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-accent',
        className,
      )}
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
