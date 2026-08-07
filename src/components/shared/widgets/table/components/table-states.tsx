import { Loader2Icon, TableIcon } from "lucide-react";

export const TableDataNotFound = ({ label }: { label: string }) => {
  return (
    <div className="flex w-full min-w-0 items-center justify-center gap-3 py-10 text-muted-foreground">
      <TableIcon className="size-5 shrink-0" />
      <p className="text-sm">{label}</p>
    </div>
  );
};

export const LoadingTableDataBlock = ({ label }: { label: string }) => {
  return (
    <output
      className="flex w-full min-w-0 items-center justify-center gap-3 py-10 text-muted-foreground"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2Icon className="size-5 shrink-0 animate-spin" />
      <p className="text-sm">{label}</p>
    </output>
  );
};
