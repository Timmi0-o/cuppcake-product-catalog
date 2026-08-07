"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { productCollectionsGetOne } from "@/actions/product-collection/actions";
import type { IProductCollection } from "@/actions/product-collection/models/product-collection.schema";
import { handleActionError } from "@/hooks/actions/handle-action-error";

export const productCollectionGetOneQueryKey = (collectionId: string) =>
  ["product-collections", "one", collectionId] as const;

export const useProductCollectionGetOne = (
  collectionId: string | undefined,
  options: { enabled?: boolean; errorMessage?: string } = {},
) => {
  const t = useTranslations("pages.catalog");
  const enabled = Boolean(collectionId) && (options.enabled ?? true);

  return useQuery({
    queryKey: productCollectionGetOneQueryKey(collectionId ?? ""),
    queryFn: async (): Promise<IProductCollection> => {
      const response = await productCollectionsGetOne(collectionId as string);
      handleActionError(
        response,
        options.errorMessage ?? t("collectionsLoadError"),
      );
      return response.result?.data as IProductCollection;
    },
    enabled,
  });
};
