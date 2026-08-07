import { ProductPage } from '@/components/pages/product/product-page';
import { setRequestLocale } from 'next-intl/server';

type ProductRoutePageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ProductRoutePage({
  params,
}: ProductRoutePageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <ProductPage productId={id} />;
}
