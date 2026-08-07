import { categoriesGetMany } from '@/actions/category/actions';
import { measurementUnitsGetMany } from '@/actions/measurement-unit/actions';
import { AdminProductForm } from '@/components/pages/admin/products/components/admin-product-form/admin-product-form';

export async function AdminProductCreatePage() {
  const [categoriesResponse, unitsResponse] = await Promise.all([
    categoriesGetMany(),
    measurementUnitsGetMany(),
  ]);

  return (
    <AdminProductForm
      mode="create"
      categories={categoriesResponse.result?.data ?? []}
      measurementUnits={unitsResponse.result?.data ?? []}
    />
  );
}
