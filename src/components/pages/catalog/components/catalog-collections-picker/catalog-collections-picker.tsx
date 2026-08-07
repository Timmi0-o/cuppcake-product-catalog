"use client";

import { LayersIcon, XIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import type { IProductCollection } from "@/actions/product-collection/models/product-collection.schema";
import { CatalogCollectionsDialog } from "@/components/pages/catalog/components/catalog-collections-dialog/catalog-collections-dialog";
import { Button } from "@/components/shared/ui/button";
import { useRouter } from "@/helpers/i18n/routing";
import { useProductCollectionGetOne } from "@/hooks/actions/product-collection/use-product-collection-get-one";
import styles from "./catalog-collections-picker.module.css";

type CatalogCollectionsPickerProps = {
  onCollectionSelect?: () => void;
};

export function CatalogCollectionsPicker({
  onCollectionSelect,
}: CatalogCollectionsPickerProps) {
  const t = useTranslations("pages.catalog");
  const router = useRouter();
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collection") ?? undefined;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const collectionQuery = useProductCollectionGetOne(collectionId);
  const selectedCollection = collectionQuery.data;

  const handleSelect = useCallback(
    (collection: IProductCollection) => {
      onCollectionSelect?.();
      setIsDialogOpen(false);
      router.push(`/?collection=${collection.id}`);
    },
    [onCollectionSelect, router],
  );

  const handleClear = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div className={styles.root}>
      <Button
        type="button"
        variant="default"
        className={styles.trigger}
        onClick={() => setIsDialogOpen(true)}
      >
        <LayersIcon aria-hidden />
        {t("collectionsButton")}
      </Button>

      {collectionId && selectedCollection ? (
        <span className={styles.chip}>
          <span className={styles.chipLabel}>{selectedCollection.name}</span>
          <button
            type="button"
            className={styles.chipClear}
            onClick={handleClear}
            aria-label={t("collectionsClearAriaLabel")}
          >
            <XIcon className={styles.chipClearIcon} aria-hidden />
          </button>
        </span>
      ) : null}

      {collectionId && collectionQuery.isLoading ? (
        <span className={styles.chipSkeleton} aria-hidden />
      ) : null}

      <CatalogCollectionsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedCollectionId={collectionId}
        onSelect={handleSelect}
      />
    </div>
  );
}
