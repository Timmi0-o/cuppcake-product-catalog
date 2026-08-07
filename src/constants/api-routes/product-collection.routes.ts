import { API_URL } from './api-url.constant';

export const PRODUCT_COLLECTION_ROUTES = {
  getMany: `${API_URL}/product-collections`,
  getOne: (id: string) => `${API_URL}/product-collections/${id}`,
} as const;
