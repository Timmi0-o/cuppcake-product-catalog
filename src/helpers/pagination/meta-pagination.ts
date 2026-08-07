import type { IAppActionResponseMeta } from '@/contracts/api-response/types';

export const hasMoreFromMeta = (
  meta: IAppActionResponseMeta | undefined,
  loadedCount: number,
): boolean => {
  if (!meta) {
    return false;
  }

  return loadedCount < meta.totalCount;
};

export const getNextPageFromMeta = (
  meta: IAppActionResponseMeta | undefined,
): number | undefined => {
  if (!meta) {
    return undefined;
  }

  const loadedThroughPage = meta.page * meta.limit;
  return loadedThroughPage < meta.totalCount ? meta.page + 1 : undefined;
};

export const getPendingSkeletonCount = (
  meta: IAppActionResponseMeta | undefined,
  loadedCount: number,
): number => {
  if (!meta) {
    return 0;
  }

  return Math.min(meta.limit, Math.max(0, meta.totalCount - loadedCount));
};
