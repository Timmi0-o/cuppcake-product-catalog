"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { DataTable } from "@/components/shared/widgets/table/table";
import useLocalStorage from "@/hooks/use-local-storage";
import { useManageSearchParams } from "@/hooks/use-manage-search-params";
import { useUpdatePaginationStatesByRender } from "./hooks/use-update-pagination-states-by-render";
import type { IUseTableProps } from "./types/i-use-table-props";
import { createTableSettingsColumn } from "./utils/create-table-settings-column";
import {
  DEFAULT_TABLE_ROWS_PER_PAGE,
  getSafeRowsPerPage,
} from "./utils/get-safe-rows-per-page";
import { getTableSettingsColumns } from "./utils/get-table-settings-columns";

export const useTable = <TData,>({
  items,
  columns,
  states,
  columnVisibleStringKey,
  defaultVisibleColumns = {},
  selectedRowsStringKey,
  enableMultiRowSelection = true,
  handleChangePage,
  isLoading = false,
  isChangeQueryUrl = true,
  getRowId,
}: IUseTableProps<TData>) => {
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<VisibilityState>(
      columnVisibleStringKey ?? "",
      defaultVisibleColumns,
    );

  const [rowsPerPage, setRowsPerPage] = useState(
    String(DEFAULT_TABLE_ROWS_PER_PAGE),
  );
  const [page, setPage] = useState(1);

  const safeRowsPerPage = getSafeRowsPerPage(rowsPerPage);

  const pages = useMemo(
    () => Math.ceil(items.count / safeRowsPerPage) || 1,
    [items.count, safeRowsPerPage],
  );

  const { handlePushKeyInSearchParams } = useManageSearchParams();

  useUpdatePaginationStatesByRender({
    rowsPerPage,
    isChangeQueryUrl,
    setRowsPerPage,
    setPage,
  });

  const handlePageChange = (pageIndex: number): void => {
    if (handleChangePage) {
      handleChangePage(pageIndex);
      return;
    }

    handlePushKeyInSearchParams({
      key: "page",
      value: pageIndex === 1 ? null : pageIndex,
    });
  };

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => {
    if (typeof window !== "undefined" && selectedRowsStringKey) {
      const saved = localStorage.getItem(selectedRowsStringKey);
      return saved ? (JSON.parse(saved) as RowSelectionState) : {};
    }
    return {};
  });

  const handleSetRowSelection = useCallback(
    (updater: Updater<RowSelectionState>) => {
      if (!selectedRowsStringKey) {
        return;
      }

      setRowSelection((prev) => {
        const newSelection =
          typeof updater === "function" ? updater(prev) : updater;
        localStorage.setItem(
          selectedRowsStringKey,
          JSON.stringify(newSelection || {}),
        );
        return newSelection;
      });
    },
    [selectedRowsStringKey],
  );

  const normalizedData = "items" in items ? items.items : items.rows;

  const tableColumns = useMemo(
    () => [...columns, createTableSettingsColumn<TData>()],
    [columns],
  );

  const tableSettingsColumns = useMemo(
    () => getTableSettingsColumns(columns),
    [columns],
  );

  const selectedCount = useMemo(
    () => Object.values(rowSelection).filter(Boolean).length,
    [rowSelection],
  );

  const handleTableColumnVisibilityChange = useCallback(
    (visibility: VisibilityState) => {
      setColumnVisibility((prev) => ({ ...prev, ...visibility }));
    },
    [setColumnVisibility],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: normalizedData ?? [],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: Boolean(selectedRowsStringKey),
    enableMultiRowSelection,
    getRowId,
    state: {
      rowSelection,
      ...(columnVisibleStringKey ? { columnVisibility } : {}),
      ...states,
    },
    onRowSelectionChange: handleSetRowSelection,
    ...(columnVisibleStringKey
      ? {
          onColumnVisibilityChange: (
            updaterOrValue: Updater<VisibilityState> | VisibilityState,
          ) => {
            setColumnVisibility((prev) => {
              if (typeof updaterOrValue === "function") {
                return { ...prev, ...updaterOrValue(prev) };
              }
              return { ...prev, ...updaterOrValue };
            });
          },
        }
      : {}),
  });

  const rowModel = table.getRowModel();

  const renderTable = () => (
    <DataTable<TData>
      table={table}
      isLoading={isLoading}
      pages={pages}
      page={page}
      handleChangePage={handlePageChange}
      normalizedDataLength={normalizedData?.length ?? 0}
      rows={rowModel.rows}
      rowsPerPage={rowsPerPage}
      totalCount={items.count}
      selectedCount={selectedCount}
      tableSettings={{
        columns: tableSettingsColumns,
        columnVisibility,
        onColumnVisibilityChange: handleTableColumnVisibilityChange,
        isColumnVisibilityEnabled: Boolean(columnVisibleStringKey),
      }}
    />
  );

  return {
    rowsPerPage,
    page,
    setRowsPerPage,
    setPage,
    renderTable,
    filters: {
      limit: rowsPerPage,
      page,
    },
    selectedCount,
    rowSelection,
  };
};
