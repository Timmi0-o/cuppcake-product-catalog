"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ICatalogStats } from "@/actions/admin/models/catalog-stats.schema";
import styles from "./admin-price-histogram-chart.module.css";

type AdminPriceHistogramChartProps = {
  stats: ICatalogStats;
};

const formatAxisPrice = (value: number) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(value);

export function AdminPriceHistogramChart({
  stats,
}: AdminPriceHistogramChartProps) {
  const t = useTranslations("pages.admin");

  const data = useMemo(
    () =>
      stats.priceBuckets.map((bucket) => ({
        label: t("chartBucketLabel", {
          from: formatAxisPrice(bucket.from),
          to: formatAxisPrice(bucket.to),
        }),
        count: bucket.count,
        from: bucket.from,
        to: bucket.to,
      })),
    [stats.priceBuckets, t],
  );

  const hasData = data.some((item) => item.count > 0);

  return (
    <article className={styles.chartCard}>
      <header>
        <h2 className={styles.title}>{t("chartPriceHistogramTitle")}</h2>
        <p className={styles.description}>
          {t("chartPriceHistogramDescription")}
        </p>
      </header>
      <div className={styles.chartArea}>
        {!hasData ? (
          <p className={styles.empty}>{t("chartEmpty")}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={56}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                formatter={(value) => [String(value ?? 0), t("chartCount")]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--popover)",
                  color: "var(--popover-foreground)",
                }}
              />
              <Bar
                dataKey="count"
                fill="var(--chart-1)"
                radius={[10, 10, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </article>
  );
}
