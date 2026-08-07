import type { ISlice } from './find-many-params';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export function mapPaginationToSlice(params?: {
  page?: number;
  limit?: number;
}): ISlice {
  const limit = params?.limit ?? DEFAULT_LIMIT;
  const page = params?.page ?? DEFAULT_PAGE;

  return { offset: (page - 1) * limit, limit };
}
