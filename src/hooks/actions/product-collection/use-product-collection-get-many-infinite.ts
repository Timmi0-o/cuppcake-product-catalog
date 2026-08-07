"use client";

import { useTranslations } from "next-intl";
import { productCollectionsGetMany } from "@/actions/product-collection/actions";
import {
  type ProductCollectionInfiniteFilters,
  useProductCollectionInfiniteList,
} from "./helpers/use-product-collection-infinite-list";

export const productCollectionGetManyInfiniteQueryKey = (
  filters?: ProductCollectionInfiniteFilters,
) => ["product-collections", "many", "infinite", filters] as const;

export const useProductCollectionGetManyInfinite = (
  filters: ProductCollectionInfiniteFilters = {},
  options: { enabled?: boolean; errorMessage?: string } = {},
) => {
  const t = useTranslations("pages.catalog");
  const limit = filters.limit ?? 20;

  return useProductCollectionInfiniteList({
    queryKey: productCollectionGetManyInfiniteQueryKey(filters),
    fetchPage: (page) =>
      productCollectionsGetMany({
        filters: {
          limit,
          page,
        },
      }),
    errorMessage: options.errorMessage ?? t("collectionsLoadError"),
    enabled: options.enabled ?? true,
    defaultLimit: limit,
  });
};
