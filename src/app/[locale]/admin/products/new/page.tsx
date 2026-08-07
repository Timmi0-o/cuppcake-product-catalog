import { AdminProductCreatePage } from '@/components/pages/admin/products/admin-product-create-page';
import { setRequestLocale } from 'next-intl/server';

type AdminProductCreateRoutePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminProductCreateRoutePage({
  params,
}: AdminProductCreateRoutePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminProductCreatePage />;
}
