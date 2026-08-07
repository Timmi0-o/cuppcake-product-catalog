"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { IProduct } from "@/actions/product/models/product.schema";
import { createSelectColumn } from "@/components/shared/widgets/table/utils/create-select-column";
import { createTableColumnsRenderer } from "@/components/shared/widgets/table/utils/create-table-columns-renderer";
import { useProductDelete } from "@/hooks/actions/product/use-product-delete";
import { createAdminProductsColumnsConfig } from "./config/admin-products-columns-config";
import type { IAdminProductsTableContext } from "./types/i-admin-products-table-context";

interface IUseAdminProductsColumnsProps {
  onDeleteSuccess?: () => void;
}

export const useAdminProductsColumns = ({
  onDeleteSuccess,
}: IUseAdminProductsColumnsProps = {}): {
  columns: ColumnDef<IProduct>[];
} => {
  const t = useTranslations("pages.admin");
  const deleteMutation = useProductDelete();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );

  const handleDeleteClick = (product: IProduct) => {
    const confirmed = window.confirm(
      t("deleteConfirmNamed", { name: product.name }),
    );
    if (!confirmed) {
      return;
    }

    setDeletingProductId(product.id);
    void deleteMutation
      .mutateAsync(product.id)
      .then(() => {
        onDeleteSuccess?.();
      })
      .finally(() => {
        setDeletingProductId(null);
      });
  };

  const context: IAdminProductsTableContext = {
    onDeleteProduct: handleDeleteClick,
    isDeleting: deleteMutation.isPending,
    deletingProductId,
  };

  const dataColumns = createTableColumnsRenderer<
    IProduct,
    IAdminProductsTableContext
  >({
    columnsConfig: createAdminProductsColumnsConfig(t),
    context,
  });

  const columns: ColumnDef<IProduct>[] = [
    createSelectColumn<IProduct>(t("selectAllRows"), t("selectRow")),
    ...dataColumns,
  ];

  return { columns };
};
