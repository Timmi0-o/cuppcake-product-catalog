"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { IProductCollection } from "@/actions/product-collection/models/product-collection.schema";
import type { IAppActionResponse } from "@/contracts/api-response/types";
import { getNextPageFromMeta } from "@/helpers/pagination/meta-pagination";
import { handleActionError } from "@/hooks/actions/handle-action-error";

type ProductCollectionInfiniteFilters = {
  limit?: number;
};

type UseProductCollectionInfiniteListParams = {
  queryKey: readonly unknown[];
  fetchPage: (
    page: number,
  ) => Promise<IAppActionResponse<IProductCollection[]>>;
  errorMessage: string;
  enabled: boolean;
  defaultLimit?: number;
};

export const useProductCollectionInfiniteList = ({
  queryKey,
  fetchPage,
  errorMessage,
  enabled,
  defaultLimit = 20,
}: UseProductCollectionInfiniteListParams) => {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const response = await fetchPage(pageParam);
      handleActionError(response, errorMessage);
      return response.result as NonNullable<
        IAppActionResponse<IProductCollection[]>["result"]
      >;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getNextPageFromMeta(lastPage?.meta),
    enabled,
  });

  const items = useMemo(
    () =>
      query.data?.pages.flatMap((page) => page?.data ?? []) ??
      ([] as IProductCollection[]),
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

export type { ProductCollectionInfiniteFilters };
