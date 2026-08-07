'use client';

import { Input } from '@/components/shared/ui/input';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './catalog-search-input.module.css';

type CatalogSearchInputProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export function CatalogSearchInput({
  value,
  onValueChange,
}: CatalogSearchInputProps) {
  const t = useTranslations('pages.catalog');

  return (
    <label className={styles.root}>
      <span className="sr-only">{t('searchAriaLabel')}</span>
      <SearchIcon className={styles.icon} aria-hidden />
      <Input
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={t('searchPlaceholder')}
        className={styles.input}
        autoComplete="off"
      />
    </label>
  );
}
