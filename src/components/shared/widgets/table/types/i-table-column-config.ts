import type { ReactNode } from "react";

export interface ITableColumnCellProps<TRow extends object, TContext> {
  row: TRow;
  value: unknown;
  context: TContext;
}

export interface ITableColumnConfig<TRow extends object, TContext> {
  id?: string;
  accessorKey?: Extract<keyof TRow, string>;
  accessorFn?: (row: TRow) => unknown;
  header: string;
  enableSorting?: boolean;
  enableResizing?: boolean;
  size?: number;
  minSize?: number;
  maxSize?: number;
  Cell: (props: ITableColumnCellProps<TRow, TContext>) => ReactNode;
}

export interface ICreateTableColumnsRendererParams<
  TRow extends object,
  TContext,
> {
  columnsConfig: ITableColumnConfig<TRow, TContext>[];
  context: TContext;
}
