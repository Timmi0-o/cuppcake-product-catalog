import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/shared/ui/checkbox";

export const createSelectColumn = <TData,>(
  selectAllAriaLabel: string,
  selectRowAriaLabel: string,
): ColumnDef<TData> => ({
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      indeterminate={
        table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
      }
      onCheckedChange={(checked) => {
        table.toggleAllPageRowsSelected(Boolean(checked));
      }}
      aria-label={selectAllAriaLabel}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={(checked) => {
        row.toggleSelected(Boolean(checked));
      }}
      aria-label={selectRowAriaLabel}
    />
  ),
  enableSorting: false,
  enableHiding: false,
  size: 40,
  minSize: 40,
  maxSize: 40,
});
