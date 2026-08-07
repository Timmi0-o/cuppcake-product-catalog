"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { IProductCollection } from "@/actions/product-collection/models/product-collection.schema";
import {
  AdaptiveDialog,
  useAdaptiveDialog,
} from "@/components/shared/components/adaptive-dialog/adaptive-dialog";
import { EmptyState } from "@/components/shared/components/empty-state/empty-state";
import { Button } from "@/components/shared/ui/button";
import { Skeleton } from "@/components/shared/ui/skeleton";
import { getPendingSkeletonCount } from "@/helpers/pagination/meta-pagination";
import { useProductCollectionGetManyInfinite } from "@/hooks/actions/product-collection/use-product-collection-get-many-infinite";
import { useInfiniteScrollObserver } from "@/hooks/use-infinite-scroll-observer";
import { cn } from "@/lib/utils";
import styles from "./catalog-collections-dialog.module.css";

const PAGE_LIMIT = 20;

type CatalogCollectionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCollectionId?: string;
  onSelect: (collection: IProductCollection) => void;
};

function CatalogCollectionsList({
  open,
  selectedCollectionId,
  onSelect,
}: {
  open: boolean;
  selectedCollectionId?: string;
  onSelect: (collection: IProductCollection) => void;
}) {
  const t = useTranslations("pages.catalog");
  const { isMobile } = useAdaptiveDialog();

  const listQuery = useProductCollectionGetManyInfinite(
    { limit: PAGE_LIMIT },
    { enabled: open },
  );

  const handleLoadMore = useCallback(() => {
    if (!listQuery.hasNextPage || listQuery.isFetchingNextPage) {
      return;
    }
    void listQuery.fetchNextPage();
  }, [
    listQuery.fetchNextPage,
    listQuery.hasNextPage,
    listQuery.isFetchingNextPage,
  ]);

  const { sentinelRef, rootRef } = useInfiniteScrollObserver({
    onLoadMore: handleLoadMore,
    hasMore: listQuery.hasNextPage,
    isLoading: listQuery.isFetchingNextPage,
    enabled: open && !listQuery.isLoading && !listQuery.error,
  });

  const skeletonCount = listQuery.isFetchingNextPage
    ? getPendingSkeletonCount(listQuery.meta, listQuery.items.length) ||
      listQuery.limit
    : 0;

  return (
    <div
      ref={rootRef}
      className={cn(styles.list, !isMobile && styles.listConstrained)}
    >
      {listQuery.isLoading ? (
        <div className={styles.skeletonList}>
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton
              key={`collection-skeleton-initial-${index + 1}`}
              className={styles.skeletonItem}
            />
          ))}
        </div>
      ) : null}

      {listQuery.error ? (
        <EmptyState
          message={t("collectionsLoadError")}
          description={t("collectionsLoadErrorDescription")}
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => void listQuery.refetch()}
            >
              {t("retry")}
            </Button>
          }
        />
      ) : null}

      {!listQuery.isLoading &&
      !listQuery.error &&
      listQuery.items.length === 0 ? (
        <EmptyState
          message={t("collectionsEmptyTitle")}
          description={t("collectionsEmptyDescription")}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.error
        ? listQuery.items.map((collection) => {
            const isSelected = collection.id === selectedCollectionId;

            return (
              <button
                key={collection.id}
                type="button"
                className={cn(styles.item, isSelected && styles.itemSelected)}
                onClick={() => onSelect(collection)}
                aria-pressed={isSelected}
              >
                <span className={styles.itemName}>{collection.name}</span>
              </button>
            );
          })
        : null}

      {skeletonCount > 0
        ? Array.from({ length: skeletonCount }, (_, index) => (
            <Skeleton
              key={`collection-skeleton-more-${index + 1}`}
              className={styles.skeletonItem}
            />
          ))
        : null}

      <div ref={sentinelRef} className={styles.sentinel} aria-hidden />
    </div>
  );
}

export function CatalogCollectionsDialog({
  open,
  onOpenChange,
  selectedCollectionId,
  onSelect,
}: CatalogCollectionsDialogProps) {
  const t = useTranslations("pages.catalog");

  return (
    <AdaptiveDialog open={open} onOpenChange={onOpenChange}>
      <AdaptiveDialog.Content className={styles.content}>
        <AdaptiveDialog.Header>
          <AdaptiveDialog.Title>{t("collectionsTitle")}</AdaptiveDialog.Title>
          <AdaptiveDialog.Description>
            {t("collectionsDescription")}
          </AdaptiveDialog.Description>
        </AdaptiveDialog.Header>

        <CatalogCollectionsList
          open={open}
          selectedCollectionId={selectedCollectionId}
          onSelect={onSelect}
        />
      </AdaptiveDialog.Content>
    </AdaptiveDialog>
  );
}
