import { AdminPage } from '@/components/pages/admin/admin-page';
import { setRequestLocale } from 'next-intl/server';

type AdminRoutePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminRoutePage({ params }: AdminRoutePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminPage />;
}
