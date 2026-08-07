"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/shared/ui/button";
import { getPaginationVisiblePages } from "@/components/shared/widgets/table/utils/get-pagination-visible-pages";
import { useMediaQuery } from "@/hooks/use-media-query";

interface IPaginationBlockProps {
  rowsPerPage: number;
  page: number;
  data: { count: number };
  pages: number;
  handlePageChange: (page: number) => void;
  summaryLabel: (from: number, to: number, total: number) => string;
  prevLabel: string;
  nextLabel: string;
}

export const PaginationBlock = ({
  rowsPerPage,
  page,
  data,
  pages,
  handlePageChange,
  summaryLabel,
  prevLabel,
  nextLabel,
}: IPaginationBlockProps) => {
  const isCompact = useMediaQuery("(max-width: 639px)");
  const limit = rowsPerPage;
  const paginationSummary = useMemo((): string => {
    if (data.count === 0) {
      return summaryLabel(0, 0, 0);
    }
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, data.count);
    return summaryLabel(from, to, data.count);
  }, [data.count, limit, page, summaryLabel]);

  const visiblePaginationSlots = useMemo(
    () => getPaginationVisiblePages(page, pages),
    [page, pages],
  );

  if (data.count <= rowsPerPage) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-4 left-1/2 z-10 flex w-[calc(100%-1.5rem)] max-w-fit -translate-x-1/2 justify-center rounded-2xl border border-border bg-card/95 p-1.5 shadow-[0_12px_40px_rgb(0_0_0_/0.12)] backdrop-blur-sm sm:bottom-5 sm:w-fit sm:p-2">
      <div className="flex flex-col items-center gap-1.5 sm:gap-2">
        <p className="max-w-[90vw] truncate px-1 text-[0.7rem] whitespace-nowrap text-muted-foreground sm:text-xs">
          {paginationSummary}
        </p>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button
            size={isCompact ? "icon-xs" : "sm"}
            variant="outline"
            disabled={page <= 1}
            aria-label={prevLabel}
            onClick={() => handlePageChange(page - 1)}
          >
            <ChevronLeftIcon className="size-4" />
            {!isCompact ? prevLabel : null}
          </Button>
          {visiblePaginationSlots.map((slot, slotIndex) =>
            slot === "ellipsis" ? (
              <span
                key={`ellipsis-after-${String(visiblePaginationSlots[slotIndex - 1] ?? "start")}`}
                className="px-1 text-sm text-muted-foreground sm:px-2"
              >
                …
              </span>
            ) : (
              <Button
                key={`page-${slot}`}
                size={isCompact ? "icon-xs" : "sm"}
                variant={slot === page ? "default" : "outline"}
                onClick={() => handlePageChange(slot)}
              >
                {slot}
              </Button>
            ),
          )}
          <Button
            size={isCompact ? "icon-xs" : "sm"}
            variant="outline"
            disabled={page >= pages}
            aria-label={nextLabel}
            onClick={() => handlePageChange(page + 1)}
          >
            {!isCompact ? nextLabel : null}
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
