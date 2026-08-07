import type { CellContext, ColumnDef } from "@tanstack/react-table";
import type {
  ICreateTableColumnsRendererParams,
  ITableColumnConfig,
} from "../types/i-table-column-config";

const buildColumnDef = <TRow extends object, TContext>(
  column: ITableColumnConfig<TRow, TContext>,
  context: TContext,
): ColumnDef<TRow> => {
  const hasAccessor = column.accessorKey != null || column.accessorFn != null;

  const columnDef = {
    header: column.header,
    enableSorting: column.enableSorting ?? false,
    enableResizing: column.enableResizing ?? true,
    size: column.size,
    minSize: column.minSize,
    maxSize: column.maxSize,
    cell: (cellContext: CellContext<TRow, unknown>) =>
      column.Cell({
        row: cellContext.row.original,
        value: hasAccessor ? cellContext.getValue() : undefined,
        context,
      }),
    ...(column.id != null ? { id: column.id } : {}),
    ...(column.accessorKey != null ? { accessorKey: column.accessorKey } : {}),
    ...(column.accessorFn != null ? { accessorFn: column.accessorFn } : {}),
  };

  return columnDef as ColumnDef<TRow>;
};

export const createTableColumnsRenderer = <TRow extends object, TContext>({
  columnsConfig,
  context,
}: ICreateTableColumnsRendererParams<TRow, TContext>): ColumnDef<TRow>[] =>
  columnsConfig.map((column) => buildColumnDef(column, context));
