import type { IActionFilters } from '@/types/i-action.types';

const SCALAR_FILTER_KEYS = new Set([
  'limit',
  'offset',
  'page',
  'name',
  'categoryId',
  'categorySlug',
  'includeImages',
  'q',
  'sort',
]);

const QUERY_PARAMS_HANDLED_SEPARATELY = new Set(['requiredIds']);

export const defaultQueryFormatter = <TFilters>(
  filters: IActionFilters<TFilters>,
): Record<string, string> | undefined => {
  const params: Record<string, string> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (QUERY_PARAMS_HANDLED_SEPARATELY.has(key)) {
      return;
    }

    if (SCALAR_FILTER_KEYS.has(key) || typeof value !== 'object') {
      params[key] = typeof value === 'string' ? value : String(value);
      return;
    }

    params[key] = JSON.stringify(value);
  });

  return Object.keys(params).length > 0 ? params : undefined;
};
