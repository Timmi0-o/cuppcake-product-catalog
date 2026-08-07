import type { IProduct } from "@/actions/product/models/product.schema";
import type { ITableColumnCellProps } from "@/components/shared/widgets/table/types/i-table-column-config";

export type IAdminProductsTableContext = {
  onDeleteProduct: (product: IProduct) => void;
  isDeleting: boolean;
  deletingProductId: string | null;
};

export type IAdminProductCellProps = ITableColumnCellProps<
  IProduct,
  IAdminProductsTableContext
>;
