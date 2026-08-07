import { categoriesGetMany } from '@/actions/category/actions';
import { CatalogContent } from '@/components/pages/catalog/components/catalog-content/catalog-content';

type CatalogPageProps = {
  categorySlug?: string;
};

export async function CatalogPage({ categorySlug }: CatalogPageProps) {
  const categoriesResponse = await categoriesGetMany();
  const categories = categoriesResponse.result?.data ?? [];

  return (
    <CatalogContent categories={categories} categorySlug={categorySlug} />
  );
}
