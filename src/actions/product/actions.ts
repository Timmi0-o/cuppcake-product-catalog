'use server';

import { API_ROUTES } from '@/constants/api-routes';
import { cuppcakeEndpointResponseMapper } from '@/contracts/api-response/cuppcake-api-core';
import type { IAppActionResponse } from '@/contracts/api-response/types';
import {
  abstractGetAction,
  abstractMutateAction,
} from '@/helpers/actions/action.helper';
import type {
  IGetActionOptions,
  IMutateActionOptions,
} from '@/types/i-action.types';
import { revalidatePath } from 'next/cache';
import {
  ProductsGetManyFiltersSchema,
  ProductsGetOneFiltersSchema,
  type IProductsGetManyFilters,
  type IProductsGetOneFilters,
} from './models/product-filter.schema';
import type {
  IProductCreateInput,
  IProductDeleteImagesInput,
  IProductUpdateInput,
} from './models/product-mutate.schema';
import type {
  IProduct,
  IProductImage,
} from './models/product.schema';

const revalidateProductPaths = (productIdOrSlug?: string) => {
  revalidatePath('/admin/products');
  revalidatePath('/');
  if (productIdOrSlug) {
    revalidatePath(`/admin/products/${productIdOrSlug}`);
    revalidatePath(`/product/${productIdOrSlug}`);
  }
};

export const productsGetMany = async (
  options: IGetActionOptions<IProductsGetManyFilters> = {},
): Promise<IAppActionResponse<IProduct[]>> =>
  abstractGetAction<IProduct[], IProductsGetManyFilters>(
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

export const productsCreate = async (
  data: IProductCreateInput,
  options: Omit<IMutateActionOptions<IProductCreateInput>, 'url' | 'params'> = {},
): Promise<IAppActionResponse<IProduct | null>> =>
  abstractMutateAction<IProductCreateInput, IProduct | null>(
    {
      url: API_ROUTES.products.create,
      authMode: 'required',
      params: {
        method: 'POST',
        body: data,
      },
      onOk: () => {
        revalidateProductPaths();
      },
      ...options,
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
    },
  );

export const productsUpdate = async (
  productIdOrSlug: string,
  data: IProductUpdateInput,
  options: Omit<
    IMutateActionOptions<IProductUpdateInput>,
    'url' | 'params'
  > = {},
): Promise<IAppActionResponse<IProduct | null>> =>
  abstractMutateAction<IProductUpdateInput, IProduct | null>(
    {
      url: API_ROUTES.products.update(productIdOrSlug),
      authMode: 'required',
      params: {
        method: 'PATCH',
        body: data,
      },
      onOk: () => {
        revalidateProductPaths(productIdOrSlug);
      },
      ...options,
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
    },
  );

export const productsDelete = async (
  productIdOrSlug: string,
  options: Omit<IMutateActionOptions<undefined>, 'url' | 'params'> = {},
): Promise<IAppActionResponse<{ success: true } | null>> =>
  abstractMutateAction<undefined, { success: true } | null>(
    {
      url: API_ROUTES.products.delete(productIdOrSlug),
      authMode: 'required',
      params: {
        method: 'DELETE',
        body: undefined,
      },
      onOk: () => {
        revalidateProductPaths(productIdOrSlug);
      },
      ...options,
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
    },
  );

export const productsUploadImages = async (
  productIdOrSlug: string,
  formData: FormData,
  options: Omit<IMutateActionOptions<FormData>, 'url' | 'params' | 'json'> = {},
): Promise<IAppActionResponse<IProductImage[] | null>> =>
  abstractMutateAction<FormData, IProductImage[] | null>(
    {
      url: API_ROUTES.products.uploadImages(productIdOrSlug),
      authMode: 'required',
      json: false,
      params: {
        method: 'POST',
        body: formData,
      },
      onOk: () => {
        revalidateProductPaths(productIdOrSlug);
      },
      ...options,
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
    },
  );

export const productsDeleteImages = async (
  productIdOrSlug: string,
  data: IProductDeleteImagesInput,
  options: Omit<
    IMutateActionOptions<IProductDeleteImagesInput>,
    'url' | 'params'
  > = {},
): Promise<IAppActionResponse<{ success: true } | null>> =>
  abstractMutateAction<IProductDeleteImagesInput, { success: true } | null>(
    {
      url: API_ROUTES.products.deleteImages(productIdOrSlug),
      authMode: 'required',
      params: {
        method: 'DELETE',
        body: data,
      },
      onOk: () => {
        revalidateProductPaths(productIdOrSlug);
      },
      ...options,
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
    },
  );
