import { PRODUCT_ROUTES } from './product.routes';
import { CATEGORY_ROUTES } from './category.routes';
import { PRODUCT_COLLECTION_ROUTES } from './product-collection.routes';
import { AUTH_ROUTES } from './auth.routes';
import { MEASUREMENT_UNIT_ROUTES } from './measurement-unit.routes';

export { API_URL } from './api-url.constant';

export const API_ROUTES = {
  auth: AUTH_ROUTES,
  products: PRODUCT_ROUTES,
  categories: CATEGORY_ROUTES,
  productCollections: PRODUCT_COLLECTION_ROUTES,
  measurementUnits: MEASUREMENT_UNIT_ROUTES,
} as const;
