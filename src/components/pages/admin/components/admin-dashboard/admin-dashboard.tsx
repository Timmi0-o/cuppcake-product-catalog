"use client";

import { useTranslations } from "next-intl";
import { AdminDrinksDessertsChart } from "@/components/pages/admin/components/admin-dashboard/components/admin-drinks-desserts-chart/admin-drinks-desserts-chart";
import { AdminPriceHistogramChart } from "@/components/pages/admin/components/admin-dashboard/components/admin-price-histogram-chart/admin-price-histogram-chart";
import { AdminStatsSummary } from "@/components/pages/admin/components/admin-dashboard/components/admin-stats-summary/admin-stats-summary";
import { EmptyState } from "@/components/shared/components/empty-state/empty-state";
import { Button } from "@/components/shared/ui/button";
import { Skeleton } from "@/components/shared/ui/skeleton";
import { useAdminCatalogStats } from "@/hooks/actions/admin/use-admin-catalog-stats";
import styles from "./admin-dashboard.module.css";

export function AdminDashboard() {
  const t = useTranslations("pages.admin");
  const statsQuery = useAdminCatalogStats();

  if (statsQuery.isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          {["a", "b", "c", "d", "e", "f", "g"].map((skeletonId) => (
            <Skeleton key={skeletonId} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  if (statsQuery.error || !statsQuery.data) {
    return (
      <EmptyState
        message={t("statsLoadError")}
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() => void statsQuery.refetch()}
          >
            {t("statsRetry")}
          </Button>
        }
      />
    );
  }

  return (
    <div className={styles.dashboard}>
      <AdminStatsSummary stats={statsQuery.data} />
      <div className={styles.charts}>
        <AdminDrinksDessertsChart stats={statsQuery.data} />
        <AdminPriceHistogramChart stats={statsQuery.data} />
      </div>
    </div>
  );
}
