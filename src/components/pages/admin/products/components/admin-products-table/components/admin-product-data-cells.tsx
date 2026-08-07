"use client";

import type { IAdminProductCellProps } from "../types/i-admin-products-table-context";

export const AdminProductNameCell = ({ row }: IAdminProductCellProps) => (
  <span className="font-medium text-foreground">{row.name}</span>
);

export const AdminProductSlugCell = ({ row }: IAdminProductCellProps) => (
  <span className="text-muted-foreground">{row.slug}</span>
);

export const AdminProductPriceCell = ({ row }: IAdminProductCellProps) => (
  <span>{row.price} ₽</span>
);

export const AdminProductUnitCell = ({ row }: IAdminProductCellProps) => (
  <span>{row.measurementUnit.symbol}</span>
);

export const AdminProductCategoriesCell = ({ row }: IAdminProductCellProps) => {
  if (!row.categories.length) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <span
      className="max-w-[220px] truncate"
      title={row.categories.map((c) => c.name).join(", ")}
    >
      {row.categories.map((category) => category.name).join(", ")}
    </span>
  );
};

export const AdminProductCreatedAtCell = ({ row }: IAdminProductCellProps) => {
  if (!row.createdAt) {
    return <span className="text-muted-foreground">—</span>;
  }

  const formatted = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(row.createdAt));

  return <span>{formatted}</span>;
};
