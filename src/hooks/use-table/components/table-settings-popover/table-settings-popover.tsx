"use client";

import { SettingsIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shared/ui/button";
import { Checkbox } from "@/components/shared/ui/checkbox";
import { Label } from "@/components/shared/ui/label";
import { Popover } from "@/components/shared/ui/popover";
import { Select } from "@/components/shared/ui/select";
import { Separator } from "@/components/shared/ui/separator";
import { useManageSearchParams } from "@/hooks/use-manage-search-params";
import type { ITableSettingsPopoverProps } from "./i-table-settings-popover-props";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

export const TableSettingsPopover = ({
  columns,
  columnVisibility,
  onColumnVisibilityChange,
  rowsPerPage,
  totalCount,
  selectedCount,
  isColumnVisibilityEnabled,
}: ITableSettingsPopoverProps) => {
  const t = useTranslations("ui.table");
  const { handlePushKeyInSearchParams } = useManageSearchParams();

  const handleLimitChange = (limit: string): void => {
    handlePushKeyInSearchParams([
      { key: "limit", value: limit },
      { key: "page", value: null },
    ]);
  };

  const handleSelectAll = (): void => {
    const nextVisibility = columns.reduce<Record<string, boolean>>(
      (acc, column) => {
        acc[column.id] = true;
        return acc;
      },
      {},
    );

    onColumnVisibilityChange(nextVisibility);
  };

  const handleDeselectAll = (): void => {
    const nextVisibility = columns.reduce<Record<string, boolean>>(
      (acc, column) => {
        acc[column.id] = false;
        return acc;
      },
      {},
    );

    onColumnVisibilityChange(nextVisibility);
  };

  const handleColumnToggle = (columnId: string, isChecked: boolean): void => {
    onColumnVisibilityChange({ [columnId]: isChecked });
  };

  return (
    <Popover>
      <Popover.Trigger
        render={
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={t("settingsTitle")}
          />
        }
      >
        <SettingsIcon className="size-4 text-muted-foreground" />
      </Popover.Trigger>
      <Popover.Content align="end" className="min-w-[280px] rounded-2xl p-4">
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold">{t("settingsTitle")}</h4>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              {t("total")}: {totalCount}
            </span>
            <span>•</span>
            <span>
              {t("selected")}: {selectedCount}
            </span>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium">{t("rowsPerPage")}</Label>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(value) => {
                if (value) {
                  handleLimitChange(String(value));
                }
              }}
            >
              <Select.Trigger className="w-full">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {ROWS_PER_PAGE_OPTIONS.map((num) => (
                  <Select.Item key={num} value={String(num)}>
                    {t("rowsPerPageOption", { count: num })}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          {isColumnVisibilityEnabled ? (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">
                    {t("visibleColumns")}
                  </Label>
                  <div className="flex gap-1">
                    <Button size="xs" variant="ghost" onClick={handleSelectAll}>
                      {t("selectAll")}
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={handleDeselectAll}
                    >
                      {t("deselectAll")}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                  {columns.map((column) => (
                    <div
                      key={column.id}
                      className="flex items-center gap-2 text-xs"
                    >
                      <Checkbox
                        id={`table-column-${column.id}`}
                        checked={columnVisibility[column.id] !== false}
                        onCheckedChange={(checked) =>
                          handleColumnToggle(column.id, Boolean(checked))
                        }
                      />
                      <Label
                        htmlFor={`table-column-${column.id}`}
                        className="text-xs font-normal"
                      >
                        {column.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </Popover.Content>
    </Popover>
  );
};
