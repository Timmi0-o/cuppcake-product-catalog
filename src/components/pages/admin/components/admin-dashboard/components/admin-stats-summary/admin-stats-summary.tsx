"use client";

import { useTranslations } from "next-intl";
import type { ICatalogStats } from "@/actions/admin/models/catalog-stats.schema";
import styles from "./admin-stats-summary.module.css";

type AdminStatsSummaryProps = {
  stats: ICatalogStats;
};

const formatPrice = (
  value: number | null,
  empty: string,
  template: (value: string) => string,
) => {
  if (value == null) {
    return empty;
  }
  return template(
    new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0,
    }).format(value),
  );
};

export function AdminStatsSummary({ stats }: AdminStatsSummaryProps) {
  const t = useTranslations("pages.admin");

  const items = [
    { label: t("statProducts"), value: String(stats.productsTotal) },
    { label: t("statCategories"), value: String(stats.categoriesTotal) },
    { label: t("statCollections"), value: String(stats.collectionsTotal) },
    { label: t("statDrinks"), value: String(stats.drinksCount) },
    { label: t("statDesserts"), value: String(stats.dessertsCount) },
    {
      label: t("statPriceMin"),
      value: formatPrice(stats.priceMin, t("statEmptyValue"), (value) =>
        t("statPriceValue", { value }),
      ),
    },
    {
      label: t("statPriceMax"),
      value: formatPrice(stats.priceMax, t("statEmptyValue"), (value) =>
        t("statPriceValue", { value }),
      ),
    },
  ];

  return (
    <div className={styles.summary}>
      {items.map((item) => (
        <article key={item.label} className={styles.card}>
          <p className={styles.label}>{item.label}</p>
          <p className={styles.value}>{item.value}</p>
        </article>
      ))}
    </div>
  );
}
