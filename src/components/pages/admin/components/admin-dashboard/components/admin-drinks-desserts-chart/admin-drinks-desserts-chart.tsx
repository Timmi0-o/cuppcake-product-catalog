"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ICatalogStats } from "@/actions/admin/models/catalog-stats.schema";
import styles from "./admin-drinks-desserts-chart.module.css";

type AdminDrinksDessertsChartProps = {
  stats: ICatalogStats;
};

const CHART_COLORS = ["var(--chart-1)", "var(--chart-3)"];

export function AdminDrinksDessertsChart({
  stats,
}: AdminDrinksDessertsChartProps) {
  const t = useTranslations("pages.admin");

  const data = useMemo(
    () => [
      { name: t("statDrinks"), value: stats.drinksCount },
      { name: t("statDesserts"), value: stats.dessertsCount },
    ],
    [stats.dessertsCount, stats.drinksCount, t],
  );

  const hasData = data.some((item) => item.value > 0);

  return (
    <article className={styles.chartCard}>
      <header>
        <h2 className={styles.title}>{t("chartDrinksDessertsTitle")}</h2>
        <p className={styles.description}>
          {t("chartDrinksDessertsDescription")}
        </p>
      </header>
      <div className={styles.chartArea}>
        {!hasData ? (
          <p className={styles.empty}>{t("chartEmpty")}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="48%"
                outerRadius="72%"
                paddingAngle={2}
                stroke="transparent"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [String(value ?? 0), t("chartCount")]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--popover)",
                  color: "var(--popover-foreground)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </article>
  );
}
