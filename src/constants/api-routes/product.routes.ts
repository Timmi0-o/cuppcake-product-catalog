import { API_URL } from './api-url.constant';

export const PRODUCT_ROUTES = {
  getMany: `${API_URL}/products`,
  getOne: (productIdOrSlug: string) =>
    `${API_URL}/products/${encodeURIComponent(productIdOrSlug)}`,
  create: `${API_URL}/products`,
  update: (productIdOrSlug: string) =>
    `${API_URL}/products/${encodeURIComponent(productIdOrSlug)}`,
  delete: (productIdOrSlug: string) =>
    `${API_URL}/products/${encodeURIComponent(productIdOrSlug)}`,
  uploadImages: (productIdOrSlug: string) =>
    `${API_URL}/products/${encodeURIComponent(productIdOrSlug)}/images`,
  deleteImages: (productIdOrSlug: string) =>
    `${API_URL}/products/${encodeURIComponent(productIdOrSlug)}/images`,
} as const;
