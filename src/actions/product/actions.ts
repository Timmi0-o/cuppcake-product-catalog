'use server';

import { API_ROUTES } from '@/constants/api-routes';
import { cuppcakeEndpointResponseMapper } from '@/contracts/api-response/cuppcake-api-core';
import type { IAppActionResponse } from '@/contracts/api-response/types';
import { abstractGetAction } from '@/helpers/actions/action.helper';
import type { IGetActionOptions } from '@/types/i-action.types';
import {
  ProductsGetManyFiltersSchema,
  ProductsGetOneFiltersSchema,
  type IProductsGetManyFilters,
  type IProductsGetOneFilters,
} from './models/product-filter.schema';
import type { IProduct, IProductsList } from './models/product.schema';

export const productsGetMany = async (
  options: IGetActionOptions<IProductsGetManyFilters> = {},
): Promise<IAppActionResponse<IProductsList>> =>
  abstractGetAction<IProductsList, IProductsGetManyFilters>(
    {
      url: API_ROUTES.products.getMany,
      params: { method: 'GET', cache: 'no-store' },
      isPublic: true,
      isArray: true,
      ...options,
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
      queryFilterSchema: ProductsGetManyFiltersSchema,
    },
  );

export const productsGetOne = async (
  productIdOrSlug: string,
  options: IGetActionOptions<IProductsGetOneFilters> = {},
): Promise<IAppActionResponse<IProduct>> =>
  abstractGetAction<IProduct, IProductsGetOneFilters>(
    {
      url: API_ROUTES.products.getOne(productIdOrSlug),
      params: { method: 'GET', cache: 'no-store' },
      isPublic: true,
      ...options,
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
      queryFilterSchema: ProductsGetOneFiltersSchema,
    },
  );
