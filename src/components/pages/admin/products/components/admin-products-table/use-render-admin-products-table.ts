"use client";

import { useMemo } from "react";
import type { IProduct } from "@/actions/product/models/product.schema";
import { useProductGetMany } from "@/hooks/actions/product/use-product-get-many";
import { useManageSearchParams } from "@/hooks/use-manage-search-params";
import { useTable } from "@/hooks/use-table/use-table";
import { getSafeRowsPerPage } from "@/hooks/use-table/utils/get-safe-rows-per-page";
import { useAdminProductsColumns } from "./use-admin-products-columns";

const VISIBLE_COLUMNS_KEY = "visibleColumnsAdminProducts";
const SELECTED_ROWS_KEY = "selectedRowsAdminProducts";

export const useRenderAdminProductsTable = (search?: string) => {
  const { searchParams } = useManageSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = getSafeRowsPerPage(searchParams.get("limit") ?? 20);

  const filters = useMemo(
    () => ({
      page: Number.isFinite(page) && page >= 1 ? page : 1,
      limit,
      includeImages: false,
      ...(search ? { search } : {}),
    }),
    [limit, page, search],
  );

  const listQuery = useProductGetMany(filters);

  const { columns } = useAdminProductsColumns({
    onDeleteSuccess: () => {
      void listQuery.refetch();
    },
  });

  const tableData = useMemo(
    () => ({
      count: listQuery.totalCount,
      rows: listQuery.items as IProduct[],
    }),
    [listQuery.items, listQuery.totalCount],
  );

  const { renderTable } = useTable({
    items: tableData,
    columns,
    columnVisibleStringKey: VISIBLE_COLUMNS_KEY,
    selectedRowsStringKey: SELECTED_ROWS_KEY,
    isLoading: listQuery.isLoading,
    getRowId: (row) => row.id,
  });

  return {
    renderTable,
    totalCount: listQuery.totalCount,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    refetch: listQuery.refetch,
  };
};
