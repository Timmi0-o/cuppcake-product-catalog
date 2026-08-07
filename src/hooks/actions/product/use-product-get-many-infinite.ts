'use client';

import { productsGetMany } from '@/actions/product/actions';
import { useTranslations } from 'next-intl';
import {
  useProductInfiniteList,
  type ProductInfiniteFilters,
} from './helpers/use-product-infinite-list';

export const productGetManyInfiniteQueryKey = (
  filters?: ProductInfiniteFilters,
) => ['products', 'many', 'infinite', filters] as const;

export const useProductGetManyInfinite = (
  filters: ProductInfiniteFilters = {},
  options: { enabled?: boolean; errorMessage?: string } = {},
) => {
  const t = useTranslations('pages.catalog');

  return useProductInfiniteList({
    queryKey: productGetManyInfiniteQueryKey(filters),
    fetchPage: (page) =>
      productsGetMany({
        filters: {
          includeImages: true,
          limit: 20,
          ...filters,
          page,
        },
      }),
    errorMessage: options.errorMessage ?? t('loadError'),
    enabled: options.enabled ?? true,
    defaultLimit: filters.limit ?? 20,
  });
};
