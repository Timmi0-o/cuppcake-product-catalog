import { categoriesGetMany } from '@/actions/category/actions';
import { productsGetMany } from '@/actions/product/actions';
import { CategoryFilter } from '@/components/pages/catalog/components/category-filter/category-filter';
import { ProductGrid } from '@/components/pages/catalog/components/product-grid/product-grid';
import { Suspense } from 'react';

type CatalogPageProps = {
  categorySlug?: string;
};

export async function CatalogPage({ categorySlug }: CatalogPageProps) {
  const [categoriesResponse, productsResponse] = await Promise.all([
    categoriesGetMany(),
    productsGetMany({
      filters: {
        categorySlug,
        limit: 200,
        includeImages: true,
      },
    }),
  ]);

  const categories = categoriesResponse.result?.data ?? [];
  const products = productsResponse.result?.data?.items ?? [];

  return (
    <div className="space-y-8">
      <Suspense fallback={<div className="h-12 border-b border-border" />}>
        <CategoryFilter categories={categories} />
      </Suspense>

      <ProductGrid products={products} />
    </div>
  );
}
