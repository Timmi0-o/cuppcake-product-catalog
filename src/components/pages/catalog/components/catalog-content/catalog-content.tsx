"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CatalogCollectionsPicker } from "@/components/pages/catalog/components/catalog-collections-picker/catalog-collections-picker";
import { CatalogSearchInput } from "@/components/pages/catalog/components/catalog-search-input/catalog-search-input";
import {
  CategoryFilter,
  type CategoryFilterItem,
} from "@/components/pages/catalog/components/category-filter/category-filter";
import { ProductGrid } from "@/components/pages/catalog/components/product-grid/product-grid";
import { useDebounceValue } from "@/hooks/use-debounce-value";

const SEARCH_DEBOUNCE_MS = 300;

type CatalogContentProps = {
  categories: CategoryFilterItem[];
};

export function CatalogContent({ categories }: CatalogContentProps) {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") ?? undefined;
  const collectionId = searchParams.get("collection") ?? undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounceValue(
    searchQuery.trim(),
    SEARCH_DEBOUNCE_MS,
  );

  const effectiveCategorySlug = collectionId ? undefined : categorySlug;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <CategoryFilter categories={categories} />

        <CatalogSearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
        />

        <CatalogCollectionsPicker
          onCollectionSelect={() => setSearchQuery("")}
        />
      </div>

      <ProductGrid
        categorySlug={effectiveCategorySlug}
        collectionId={collectionId}
        search={debouncedSearch || undefined}
      />
    </div>
  );
}

export function CatalogContentWithSuspense({
  categories,
}: CatalogContentProps) {
  return (
    <Suspense fallback={<div className="h-12 border-b border-border" />}>
      <CatalogContent categories={categories} />
    </Suspense>
  );
}
