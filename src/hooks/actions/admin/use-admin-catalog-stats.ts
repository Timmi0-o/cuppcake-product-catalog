"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { adminCatalogStatsGet } from "@/actions/admin/actions";
import type { ICatalogStats } from "@/actions/admin/models/catalog-stats.schema";
import { handleActionError } from "@/hooks/actions/handle-action-error";

export const adminCatalogStatsQueryKey = ["admin", "catalog-stats"] as const;

export const useAdminCatalogStats = (
  options: { enabled?: boolean; errorMessage?: string } = {},
) => {
  const t = useTranslations("pages.admin");

  return useQuery({
    queryKey: adminCatalogStatsQueryKey,
    queryFn: async (): Promise<ICatalogStats> => {
      const response = await adminCatalogStatsGet();
      handleActionError(response, options.errorMessage ?? t("statsLoadError"));
      return response.result?.data as ICatalogStats;
    },
    enabled: options.enabled ?? true,
  });
};
