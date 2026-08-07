"use client";

import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/shared/ui/input";

type AdminProductsSearchProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export function AdminProductsSearch({
  value,
  onValueChange,
}: AdminProductsSearchProps) {
  const t = useTranslations("pages.admin");

  return (
    <div className="relative w-full max-w-full sm:max-w-md">
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={t("searchPlaceholder")}
        className="pl-10"
        autoComplete="off"
        aria-label={t("searchAriaLabel")}
      />
    </div>
  );
}
