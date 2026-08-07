'use client';

import { Link } from '@/helpers/i18n/routing';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export type CategoryFilterItem = {
  id: string;
  name: string;
  slug: string;
};

type CategoryFilterProps = {
  categories: CategoryFilterItem[];
};

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const t = useTranslations('pages.catalog');
  const activeCategoryId = searchParams.get('category');

  return (
    <nav
      aria-label={t('categoriesAriaLabel')}
      className="relative -mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
    >
      <ul className="flex min-w-max items-end gap-1 border-b border-border/80">
        <li>
          <Link
            href="/"
            className={cn(
              'relative inline-flex px-3 py-3 text-sm font-medium tracking-wide transition-colors',
              !activeCategoryId
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t('allCategories')}
            {!activeCategoryId ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
            ) : null}
          </Link>
        </li>
        {categories.map((category) => {
          const active = activeCategoryId === category.id;
          return (
            <li key={category.id}>
              <Link
                href={`/?category=${category.id}`}
                className={cn(
                  'relative inline-flex px-3 py-3 text-sm font-medium tracking-wide transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {category.name}
                {active ? (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
