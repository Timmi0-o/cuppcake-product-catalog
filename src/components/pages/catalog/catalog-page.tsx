import { categoriesGetMany } from "@/actions/category/actions";
import { CatalogContentWithSuspense } from "@/components/pages/catalog/components/catalog-content/catalog-content";

export async function CatalogPage() {
  const categoriesResponse = await categoriesGetMany();
  const categories = categoriesResponse.result?.data ?? [];

  return <CatalogContentWithSuspense categories={categories} />;
}
