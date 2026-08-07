import type { VisibilityState } from "@tanstack/react-table";

export interface ITableSettingsColumn {
  id: string;
  label: string;
}

export interface ITableSettingsPopoverProps {
  columns: ITableSettingsColumn[];
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (visibility: VisibilityState) => void;
  rowsPerPage: string;
  totalCount: number;
  selectedCount: number;
  isColumnVisibilityEnabled: boolean;
}
