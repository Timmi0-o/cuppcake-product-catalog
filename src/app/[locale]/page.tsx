import { CatalogPage } from '@/components/pages/catalog/catalog-page';
import { setRequestLocale } from 'next-intl/server';

type CatalogRoutePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function CatalogRoutePage({
  params,
  searchParams,
}: CatalogRoutePageProps) {
  const [{ locale }, { category }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  return <CatalogPage categoryId={category} />;
}
