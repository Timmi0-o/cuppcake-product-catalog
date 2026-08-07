import type { Row, Table } from "@tanstack/react-table";
import type { ITableSettingsPopoverProps } from "@/hooks/use-table/components/table-settings-popover/i-table-settings-popover-props";

export interface ITableProps<TData> {
  table: Table<TData>;
  isLoading?: boolean;
  pages: number;
  page: number;
  handleChangePage?: (page: number) => void;
  normalizedDataLength: number;
  rows: Row<TData>[];
  tableSettings?: Omit<
    ITableSettingsPopoverProps,
    "rowsPerPage" | "totalCount" | "selectedCount"
  >;
  rowsPerPage: string;
  totalCount: number;
  selectedCount: number;
}
