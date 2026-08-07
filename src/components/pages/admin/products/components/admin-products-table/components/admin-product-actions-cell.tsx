"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { IProduct } from "@/actions/product/models/product.schema";
import { Button } from "@/components/shared/ui/button";
import { Tooltip } from "@/components/shared/ui/tooltip";
import { Link } from "@/helpers/i18n/routing";
import type { IAdminProductCellProps } from "../types/i-admin-products-table-context";

export const AdminProductActionsCell = ({
  row,
  context,
}: IAdminProductCellProps) => {
  const t = useTranslations("pages.admin");
  const { onDeleteProduct, isDeleting, deletingProductId } = context;
  const isRowDeleting = isDeleting && deletingProductId === row.id;

  return (
    <div className="flex items-center justify-center gap-1">
      <Tooltip>
        <Tooltip.Trigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={t("actionEdit")}
              render={<Link href={`/admin/products/${row.id}`} />}
            />
          }
        >
          <PencilIcon className="size-4" />
        </Tooltip.Trigger>
        <Tooltip.Content>{t("actionEdit")}</Tooltip.Content>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={t("actionDelete")}
              disabled={isDeleting}
              onClick={() => onDeleteProduct(row as IProduct)}
            />
          }
        >
          <Trash2Icon
            className={`size-4 text-destructive ${isRowDeleting ? "opacity-50" : ""}`}
          />
        </Tooltip.Trigger>
        <Tooltip.Content>{t("actionDelete")}</Tooltip.Content>
      </Tooltip>
    </div>
  );
};
