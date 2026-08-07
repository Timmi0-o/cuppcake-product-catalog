"use client";

import { flexRender } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/ui/table";
import { PaginationBlock } from "@/components/shared/widgets/table/components/pagination-block/pagination-block";
import {
  LoadingTableDataBlock,
  TableDataNotFound,
} from "@/components/shared/widgets/table/components/table-states";
import type { ITableProps } from "@/components/shared/widgets/table/types/i-table-props";
import { TableSettingsPopover } from "@/hooks/use-table/components/table-settings-popover/table-settings-popover";
import { TABLE_SETTINGS_COLUMN_ID } from "@/hooks/use-table/constants/table-settings-column-id";
import { cn } from "@/lib/utils";

export const DataTable = <TData,>({
  table,
  isLoading = false,
  pages,
  page,
  handleChangePage,
  normalizedDataLength,
  rows,
  tableSettings,
  rowsPerPage,
  totalCount,
  selectedCount,
}: ITableProps<TData>) => {
  const t = useTranslations("ui.table");

  if (isLoading) {
    return <LoadingTableDataBlock label={t("loading")} />;
  }

  if (normalizedDataLength === 0) {
    return <TableDataNotFound label={t("noData")} />;
  }

  return (
    <>
      <div className="-mx-1 overflow-x-auto rounded-2xl border border-border bg-card sm:mx-0">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSettingsColumn =
                    header.column.id === TABLE_SETTINGS_COLUMN_ID;

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        isSettingsColumn
                          ? "w-[50px] min-w-[50px] text-center"
                          : "text-start",
                        header.column.id === "actions" && "text-center",
                        header.column.id === "select" && "w-10",
                      )}
                      style={{
                        width: header.getSize(),
                        minWidth:
                          header.column.columnDef.minSize ?? header.getSize(),
                      }}
                    >
                      {isSettingsColumn && tableSettings ? (
                        <TableSettingsPopover
                          {...tableSettings}
                          rowsPerPage={rowsPerPage}
                          totalCount={totalCount}
                          selectedCount={selectedCount}
                        />
                      ) : header.column.getCanSort() ? (
                        <button
                          type="button"
                          className="inline-flex cursor-pointer items-center gap-1 select-none"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </button>
                      ) : header.isPlaceholder ? null : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
              >
                {row.getVisibleCells().map((cell) => {
                  const isSettingsColumn =
                    cell.column.id === TABLE_SETTINGS_COLUMN_ID;

                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.id === "actions" && "text-center",
                      )}
                      style={{
                        width: cell.column.getSize(),
                        minWidth:
                          cell.column.columnDef.minSize ??
                          cell.column.getSize(),
                      }}
                    >
                      {isSettingsColumn
                        ? null
                        : flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationBlock
        rowsPerPage={Number(rowsPerPage)}
        page={page}
        data={{ count: totalCount }}
        pages={pages}
        handlePageChange={handleChangePage ?? (() => undefined)}
        summaryLabel={(from, to, total) =>
          t("paginationSummary", { from, to, total })
        }
        prevLabel={t("prev")}
        nextLabel={t("next")}
      />
    </>
  );
};
