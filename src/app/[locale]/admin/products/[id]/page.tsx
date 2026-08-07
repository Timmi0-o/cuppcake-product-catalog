import { AdminProductEditPage } from '@/components/pages/admin/products/admin-product-edit-page';
import { setRequestLocale } from 'next-intl/server';

type AdminProductEditRoutePageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function AdminProductEditRoutePage({
  params,
}: AdminProductEditRoutePageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <AdminProductEditPage productId={id} />;
}
