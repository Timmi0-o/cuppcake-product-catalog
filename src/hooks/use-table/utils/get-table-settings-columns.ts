import type { ColumnDef } from "@tanstack/react-table";
import type { ITableSettingsColumn } from "../components/table-settings-popover/i-table-settings-popover-props";
import { TABLE_SETTINGS_COLUMN_ID } from "../constants/table-settings-column-id";

const HIDDEN_SETTINGS_COLUMN_IDS = new Set([
  TABLE_SETTINGS_COLUMN_ID,
  "actions",
  "select",
]);

const getColumnId = <TData>(column: ColumnDef<TData>): string => {
  if (column.id) {
    return column.id;
  }

  if ("accessorKey" in column && column.accessorKey != null) {
    return String(column.accessorKey);
  }

  return "";
};

const getColumnLabel = <TData>(
  column: ColumnDef<TData>,
  id: string,
): string => {
  if (typeof column.header === "string") {
    return column.header;
  }

  return id;
};

export const getTableSettingsColumns = <TData>(
  columns: ColumnDef<TData>[],
): ITableSettingsColumn[] =>
  columns
    .map((column) => {
      const id = getColumnId(column);

      return {
        id,
        label: getColumnLabel(column, id),
      };
    })
    .filter(
      (column) =>
        column.id !== "" &&
        !HIDDEN_SETTINGS_COLUMN_IDS.has(column.id) &&
        column.label !== "",
    );
