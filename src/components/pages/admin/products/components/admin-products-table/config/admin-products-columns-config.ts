import type { IProduct } from "@/actions/product/models/product.schema";
import type { ITableColumnConfig } from "@/components/shared/widgets/table/types/i-table-column-config";
import { AdminProductActionsCell } from "../components/admin-product-actions-cell";
import {
  AdminProductCategoriesCell,
  AdminProductCreatedAtCell,
  AdminProductNameCell,
  AdminProductPriceCell,
  AdminProductSlugCell,
  AdminProductUnitCell,
} from "../components/admin-product-data-cells";
import type { IAdminProductsTableContext } from "../types/i-admin-products-table-context";

type TAdminProductsTranslator = (
  key:
    | "tableColumnName"
    | "tableColumnSlug"
    | "tableColumnPrice"
    | "tableColumnUnit"
    | "tableColumnCategories"
    | "tableColumnCreatedAt"
    | "tableColumnActions",
) => string;

export const createAdminProductsColumnsConfig = (
  t: TAdminProductsTranslator,
): ITableColumnConfig<IProduct, IAdminProductsTableContext>[] => [
  {
    header: t("tableColumnName"),
    accessorKey: "name",
    Cell: AdminProductNameCell,
    enableSorting: true,
    minSize: 160,
  },
  {
    header: t("tableColumnSlug"),
    accessorKey: "slug",
    Cell: AdminProductSlugCell,
    enableSorting: true,
    minSize: 140,
  },
  {
    header: t("tableColumnPrice"),
    accessorKey: "price",
    Cell: AdminProductPriceCell,
    enableSorting: true,
    size: 110,
    minSize: 90,
  },
  {
    header: t("tableColumnUnit"),
    id: "unit",
    accessorFn: (row) => row.measurementUnit.symbol,
    Cell: AdminProductUnitCell,
    enableSorting: true,
    size: 80,
    minSize: 70,
  },
  {
    header: t("tableColumnCategories"),
    id: "categories",
    accessorFn: (row) =>
      row.categories.map((category) => category.name).join(", "),
    Cell: AdminProductCategoriesCell,
    enableSorting: false,
    minSize: 160,
  },
  {
    header: t("tableColumnCreatedAt"),
    accessorKey: "createdAt",
    Cell: AdminProductCreatedAtCell,
    enableSorting: true,
    size: 120,
    minSize: 110,
  },
  {
    header: t("tableColumnActions"),
    id: "actions",
    accessorFn: () => "",
    Cell: AdminProductActionsCell,
    enableSorting: false,
    size: 100,
    minSize: 90,
  },
];
