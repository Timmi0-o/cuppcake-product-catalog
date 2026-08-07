'use client';

import type { IProductsGetManyFilters } from '@/actions/product/models/product-filter.schema';
import type { IProduct } from '@/actions/product/models/product.schema';
import type { IAppActionResponse } from '@/contracts/api-response/types';
import { getNextPageFromMeta } from '@/helpers/pagination/meta-pagination';
import { handleActionError } from '@/hooks/actions/handle-action-error';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export type ProductInfiniteFilters = Omit<
  Partial<IProductsGetManyFilters>,
  'page'
>;

type UseProductInfiniteListParams = {
  queryKey: readonly unknown[];
  fetchPage: (page: number) => Promise<IAppActionResponse<IProduct[]>>;
  errorMessage: string;
  enabled: boolean;
  defaultLimit?: number;
};

export const useProductInfiniteList = ({
  queryKey,
  fetchPage,
  errorMessage,
  enabled,
  defaultLimit = 20,
}: UseProductInfiniteListParams) => {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const response = await fetchPage(pageParam);
      handleActionError(response, errorMessage);
      return response.result as NonNullable<
        IAppActionResponse<IProduct[]>['result']
      >;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getNextPageFromMeta(lastPage?.meta),
    enabled,
  });

  const items = useMemo(
    () =>
      query.data?.pages.flatMap((page) => page?.data ?? []) ??
      ([] as IProduct[]),
    [query.data?.pages],
  );

  const meta = query.data?.pages.at(-1)?.meta;

  return {
    items,
    meta,
    limit: meta?.limit ?? defaultLimit,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    refetch: query.refetch,
  };
};
