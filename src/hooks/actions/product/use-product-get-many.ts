"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { productsGetMany } from "@/actions/product/actions";
import type { IProduct } from "@/actions/product/models/product.schema";
import type { IProductsGetManyFilters } from "@/actions/product/models/product-filter.schema";
import type { IAppActionResponse } from "@/contracts/api-response/types";
import { handleActionError } from "@/hooks/actions/handle-action-error";

export const productGetManyQueryKey = (
  filters?: Partial<IProductsGetManyFilters>,
) => ["products", "many", filters] as const;

export const useProductGetMany = (
  filters: Partial<IProductsGetManyFilters> = {},
  options: { enabled?: boolean; errorMessage?: string } = {},
) => {
  const t = useTranslations("pages.admin");

  const query = useQuery({
    queryKey: productGetManyQueryKey(filters),
    queryFn: async (): Promise<
      NonNullable<IAppActionResponse<IProduct[]>["result"]>
    > => {
      const response = await productsGetMany({
        filters: {
          includeImages: false,
          page: 1,
          limit: 20,
          ...filters,
        },
      });
      handleActionError(
        response,
        options.errorMessage ?? t("productsLoadError"),
      );
      return response.result as NonNullable<
        IAppActionResponse<IProduct[]>["result"]
      >;
    },
    enabled: options.enabled ?? true,
  });

  return {
    items: query.data?.data ?? [],
    meta: query.data?.meta,
    totalCount: query.data?.meta?.totalCount ?? query.data?.data?.length ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};
