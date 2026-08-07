import { API_URL } from './api-url.constant';

export const PRODUCT_ROUTES = {
  getMany: `${API_URL}/products`,
  getOne: (productIdOrSlug: string) =>
    `${API_URL}/products/${encodeURIComponent(productIdOrSlug)}`,
} as const;
