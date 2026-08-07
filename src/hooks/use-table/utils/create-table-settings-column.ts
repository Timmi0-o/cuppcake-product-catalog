import type { ColumnDef } from "@tanstack/react-table";
import { TABLE_SETTINGS_COLUMN_ID } from "../constants/table-settings-column-id";

export const createTableSettingsColumn = <TData>(): ColumnDef<TData> => ({
  id: TABLE_SETTINGS_COLUMN_ID,
  header: TABLE_SETTINGS_COLUMN_ID,
  cell: () => null,
  size: 50,
  minSize: 50,
  maxSize: 50,
  enableSorting: false,
  enableHiding: false,
  enableResizing: false,
});
