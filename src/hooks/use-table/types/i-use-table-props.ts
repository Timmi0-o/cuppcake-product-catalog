import type {
  ColumnDef,
  RowSelectionState,
  TableState,
  VisibilityState,
} from "@tanstack/react-table";

export type IPagedItems<T> = {
  count: number;
} & ({ rows: T[] } | { items: T[] });

export interface IUseTableProps<TData> {
  items: IPagedItems<TData>;
  columns: ColumnDef<TData>[];
  states?: Partial<TableState>;
  columnVisibleStringKey?: string;
  defaultVisibleColumns?: VisibilityState;
  selectedRowsStringKey?: string;
  handleChangePage?: (page: number) => void;
  enableMultiRowSelection?: boolean;
  isLoading?: boolean;
  isChangeQueryUrl?: boolean;
  getRowId?: (originalRow: TData, index: number) => string;
  initialRowSelection?: RowSelectionState;
}
