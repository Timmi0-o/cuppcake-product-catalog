"use client";

import { useSearchParams } from "next/navigation";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { usePathname, useRouter } from "@/helpers/i18n/routing";
import {
  DEFAULT_TABLE_ROWS_PER_PAGE,
  getSafeRowsPerPage,
  isValidTableRowsPerPage,
} from "@/hooks/use-table/utils/get-safe-rows-per-page";
import { isNumberTest } from "@/utils/is-number-test.util";

export const useUpdatePaginationStatesByRender = ({
  rowsPerPage,
  isChangeQueryUrl,
  setRowsPerPage,
  setPage,
}: {
  rowsPerPage: number | string;
  isChangeQueryUrl: boolean;
  setRowsPerPage: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchParamsString = searchParams.toString();

  // URL is the source of truth for page/limit; re-run only when it changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional URL sync
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const limit = searchParams.get("limit");
    const newSearchParams = new URLSearchParams(searchParamsString);

    if (
      pageParam !== null &&
      pageParam !== "" &&
      isNumberTest(pageParam) &&
      Number(pageParam) >= 1
    ) {
      setPage(Number(pageParam));
    } else {
      setPage(1);
    }

    if (limit !== null && isValidTableRowsPerPage(limit)) {
      setRowsPerPage(limit);
    } else {
      const fallbackLimit = String(
        getSafeRowsPerPage(rowsPerPage) || DEFAULT_TABLE_ROWS_PER_PAGE,
      );
      setRowsPerPage(fallbackLimit);
      newSearchParams.set("limit", fallbackLimit);
    }

    const newQueryString = newSearchParams.toString();
    const isUrlChanged = newQueryString !== searchParamsString;

    if (isChangeQueryUrl && isUrlChanged) {
      router.replace(`${pathname}?${newQueryString}`, { scroll: false });
    }
  }, [searchParamsString]);
};
