import { ProductPage } from '@/components/pages/product/product-page';
import { setRequestLocale } from 'next-intl/server';

type ProductRoutePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductRoutePage({
  params,
}: ProductRoutePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <ProductPage productSlug={slug} />;
}
