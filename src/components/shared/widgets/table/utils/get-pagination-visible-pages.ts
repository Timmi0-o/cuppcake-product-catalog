export type TPaginationPageSlot = number | "ellipsis";

export const getPaginationVisiblePages = (
  currentPage: number,
  totalPages: number,
): TPaginationPageSlot[] => {
  if (totalPages <= 0) {
    return [];
  }

  const maxCompactLength = 7;
  if (totalPages <= maxCompactLength) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const neighborRadius = 2;
  const pageSet = new Set<number>();
  pageSet.add(1);
  pageSet.add(totalPages);
  for (
    let i = currentPage - neighborRadius;
    i <= currentPage + neighborRadius;
    i++
  ) {
    if (i >= 1 && i <= totalPages) {
      pageSet.add(i);
    }
  }

  const sorted = Array.from(pageSet).sort((a, b) => a - b);
  const result: TPaginationPageSlot[] = [];

  for (let index = 0; index < sorted.length; index++) {
    const pageNumber = sorted[index];
    const prevPage = sorted[index - 1];
    if (prevPage !== undefined && pageNumber - prevPage > 1) {
      result.push("ellipsis");
    }
    result.push(pageNumber);
  }

  return result;
};
