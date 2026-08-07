import { categoriesGetMany } from '@/actions/category/actions';
import { measurementUnitsGetMany } from '@/actions/measurement-unit/actions';
import { productsGetOne } from '@/actions/product/actions';
import { AdminProductForm } from '@/components/pages/admin/products/components/admin-product-form/admin-product-form';
import { notFound } from 'next/navigation';

type AdminProductEditPageProps = {
  productId: string;
};

export async function AdminProductEditPage({
  productId,
}: AdminProductEditPageProps) {
  const [productResponse, categoriesResponse, unitsResponse] =
    await Promise.all([
      productsGetOne(productId, {
        filters: { includeImages: true },
      }),
      categoriesGetMany(),
      measurementUnitsGetMany(),
    ]);

  const product = productResponse.result?.data;
  if (!product) {
    notFound();
  }

  return (
    <AdminProductForm
      mode="edit"
      product={product}
      categories={categoriesResponse.result?.data ?? []}
      measurementUnits={unitsResponse.result?.data ?? []}
    />
  );
}
