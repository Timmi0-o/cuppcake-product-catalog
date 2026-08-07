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
  const activeCategorySlug = searchParams.get('category');

  return (
    <nav aria-label={t('categoriesAriaLabel')}>
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/"
            className={cn(
              'inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium tracking-wide transition-colors',
              !activeCategorySlug
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/80 text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            {t('allCategories')}
          </Link>
        </li>
        {categories.map((category) => {
          const active = activeCategorySlug === category.slug;

          return (
            <li key={category.id}>
              <Link
                href={`/?category=${category.slug}`}
                className={cn(
                  'inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium tracking-wide transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/80 text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
