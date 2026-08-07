import { isNumberTest } from "@/utils/is-number-test.util";

export const DEFAULT_TABLE_ROWS_PER_PAGE = 20;

export const getSafeRowsPerPage = (rowsPerPage: string | number): number => {
  const stringValue = String(rowsPerPage);

  if (isNumberTest(stringValue) && Number(stringValue) >= 1) {
    return Number(stringValue);
  }

  return DEFAULT_TABLE_ROWS_PER_PAGE;
};

export const isValidTableRowsPerPage = (value: string | null): boolean => {
  if (value === null || value === "") {
    return false;
  }

  return isNumberTest(value) && Number(value) >= 1;
};
