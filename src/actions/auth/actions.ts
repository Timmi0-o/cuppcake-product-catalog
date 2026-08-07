'use server';

import { API_ROUTES } from '@/constants/api-routes';
import { cuppcakeEndpointResponseMapper } from '@/contracts/api-response/cuppcake-api-core';
import type { IAppActionResponse } from '@/contracts/api-response/types';
import { abstractMutateAction } from '@/helpers/actions/action.helper';
import type {
  IAuthActionOutput,
  IAuthLoginActionInput,
  IAuthLogoutActionInput,
  IAuthLogoutActionOutput,
  IAuthRefreshActionInput,
} from './models/auth.schema';

export const login = async (
  data: IAuthLoginActionInput,
): Promise<IAppActionResponse<IAuthActionOutput | null>> =>
  abstractMutateAction<IAuthLoginActionInput, IAuthActionOutput | null>(
    {
      url: API_ROUTES.auth.login,
      isPublic: true,
      params: {
        method: 'POST',
        body: data,
      },
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
    },
  );

export const refresh = async (
  payload: IAuthRefreshActionInput,
): Promise<IAppActionResponse<IAuthActionOutput | null>> =>
  abstractMutateAction<IAuthRefreshActionInput, IAuthActionOutput | null>(
    {
      url: API_ROUTES.auth.refresh,
      isPublic: true,
      params: {
        method: 'POST',
        body: payload,
      },
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
    },
  );

export const logout = async (
  payload: IAuthLogoutActionInput = {},
): Promise<IAppActionResponse<IAuthLogoutActionOutput | null>> =>
  abstractMutateAction<IAuthLogoutActionInput, IAuthLogoutActionOutput | null>(
    {
      url: API_ROUTES.auth.logout,
      params: {
        method: 'POST',
        body: payload,
      },
    },
    {
      responseMapper: cuppcakeEndpointResponseMapper,
    },
  );
