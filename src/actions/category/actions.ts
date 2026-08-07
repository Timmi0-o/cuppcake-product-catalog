'use server';

import { API_ROUTES } from '@/constants/api-routes';
import { cuppcakeEndpointResponseMapper } from '@/contracts/api-response/cuppcake-api-core';
import type { IAppActionResponse } from '@/contracts/api-response/types';
import { abstractGetAction } from '@/helpers/actions/action.helper';
import type { IGetActionOptions } from '@/types/i-action.types';
import type { ICategory } from './models/category.schema';

export const categoriesGetMany = async (
  options: IGetActionOptions = {},
): Promise<IAppActionResponse<ICategory[]>> =>
  abstractGetAction<ICategory[]>(
    {
      url: API_ROUTES.categories.getMany,
      params: { method: 'GET', cache: 'no-store' },
      isPublic: true,
      isArray: true,
      ...options,
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
    },
  );
