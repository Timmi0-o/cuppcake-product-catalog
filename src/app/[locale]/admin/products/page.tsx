import { AdminProductsPage } from '@/components/pages/admin/products/admin-products-page';
import { setRequestLocale } from 'next-intl/server';

type AdminProductsRoutePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminProductsRoutePage({
  params,
}: AdminProductsRoutePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminProductsPage />;
}
