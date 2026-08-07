import { setRequestLocale } from "next-intl/server";
import { CatalogPage } from "@/components/pages/catalog/catalog-page";

type CatalogRoutePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CatalogRoutePage({
  params,
}: CatalogRoutePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CatalogPage />;
}
