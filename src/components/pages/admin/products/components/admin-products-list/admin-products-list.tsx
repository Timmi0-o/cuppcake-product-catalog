"use client";

import { useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";
import { AdminProductsSearch } from "@/components/pages/admin/products/components/admin-products-search/admin-products-search";
import { useRenderAdminProductsTable } from "@/components/pages/admin/products/components/admin-products-table/use-render-admin-products-table";
import { EmptyState } from "@/components/shared/components/empty-state/empty-state";
import { Button } from "@/components/shared/ui/button";
import { Link } from "@/helpers/i18n/routing";
import { useDebounceValue } from "@/hooks/use-debounce-value";
import { useManageSearchParams } from "@/hooks/use-manage-search-params";
import styles from "../../admin-products-page.module.css";

const SEARCH_DEBOUNCE_MS = 300;

function AdminProductsListContent() {
  const t = useTranslations("pages.admin");
  const { searchParams, handlePushKeyInSearchParams } = useManageSearchParams();
  const searchFromUrl = searchParams.get("search") ?? "";

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const debouncedSearch = useDebounceValue(
    searchQuery.trim(),
    SEARCH_DEBOUNCE_MS,
  );

  useEffect(() => {
    setSearchQuery(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    if (debouncedSearch === searchFromUrl) {
      return;
    }

    handlePushKeyInSearchParams([
      { key: "search", value: debouncedSearch || null },
      { key: "page", value: null },
    ]);
  }, [debouncedSearch, handlePushKeyInSearchParams, searchFromUrl]);

  const { renderTable, totalCount, isLoading, error, refetch } =
    useRenderAdminProductsTable(debouncedSearch || undefined);

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t("productsTitle")}</h1>
          <p className={styles.meta}>
            {isLoading
              ? t("productsCountLoading")
              : t("productsCount", { count: totalCount })}
          </p>
        </div>
        <Button render={<Link href="/admin/products/new" />}>
          {t("createProduct")}
        </Button>
      </div>

      <AdminProductsSearch value={searchQuery} onValueChange={setSearchQuery} />

      {error ? (
        <EmptyState
          message={t("productsLoadError")}
          description={t("productsLoadErrorDescription")}
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => void refetch()}
            >
              {t("productsRetry")}
            </Button>
          }
        />
      ) : (
        renderTable()
      )}
    </section>
  );
}

export function AdminProductsList() {
  const t = useTranslations("pages.admin");

  return (
    <Suspense
      fallback={
        <section className={styles.page}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>{t("productsTitle")}</h1>
              <p className={styles.meta}>{t("productsCountLoading")}</p>
            </div>
          </div>
        </section>
      }
    >
      <AdminProductsListContent />
    </Suspense>
  );
}
