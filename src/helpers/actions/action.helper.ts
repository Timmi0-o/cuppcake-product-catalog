import { EMPTY_DEFAULT_API_RESPONSE } from '@/constants/empty-default-api-response';
import type { ICuppcakeEndpointResponse } from '@/contracts/api-response/cuppcake-api-core';
import type { IAppActionResponse } from '@/contracts/api-response/types';
import type { IApiResponseMapper } from '@/contracts/api-response/types/i-api-response-mapper';
import type {
  IGetActionOptions,
  IMutateActionOptions,
} from '@/types/i-action.types';
import type { ZodSchema } from 'zod';
import { createError } from './create-error';
import { ErrorObjectSetup } from './error-object-setup';
import type { TAppFetcher, TAppFetcherAuthMode } from './fetchers/i-app-fetcher';
import {
  type IHttpParams,
  productCatalogFetcher,
} from './fetchers/product-catalog-fetcher';
import { setQueryFilters } from './utils/set-query-filters.util';

export interface IActionRequestWorkers {
  fetcher?: TAppFetcher;
  responseMapper: IApiResponseMapper<ICuppcakeEndpointResponse>;
  streamResponseParser?: (res: Response) => Promise<unknown>;
}

export interface IGetActionRequestWorkers<TFilters = Record<string, unknown>>
  extends IActionRequestWorkers {
  queryFilterSchema?: ZodSchema<TFilters>;
}

const resolveAuthMode = (
  isPublic: boolean,
  authMode: TAppFetcherAuthMode | undefined,
): TAppFetcherAuthMode => {
  if (authMode) {
    return authMode;
  }

  return isPublic ? 'none' : 'required';
};

export const abstractGetAction = async <
  TData,
  TFilters = Record<string, unknown>,
>(
  options: IGetActionOptions<TFilters> & { url: string },
  requestWorkers: IGetActionRequestWorkers<TFilters>,
): Promise<IAppActionResponse<TData>> => {
  const {
    url,
    params = { method: 'GET' },
    filters,
    customFormatter,
    isArray = false,
    isPublic = false,
    authMode,
  } = options;

  resolveAuthMode(isPublic, authMode);
  const requestFetcher: TAppFetcher =
    requestWorkers.fetcher ?? productCatalogFetcher;

  const finalUrl = await setQueryFilters<TFilters>(
    url,
    filters,
    requestWorkers.queryFilterSchema,
    customFormatter,
  );

  const res = await requestFetcher({
    url: finalUrl,
    params: {
      method: 'GET' as const,
      ...(params as IHttpParams<BodyInit | null | undefined>),
    },
    isPublic,
    authMode,
  });

  const errorResult = await ErrorObjectSetup(res, requestWorkers.responseMapper);

  if (errorResult?.error) {
    if (errorResult.error.statusCode === 404 && isArray) {
      return EMPTY_DEFAULT_API_RESPONSE as IAppActionResponse<TData>;
    }
    return errorResult as IAppActionResponse<TData>;
  }

  const data: unknown = requestWorkers.streamResponseParser
    ? await requestWorkers.streamResponseParser(res)
    : await res.json();

  const formattedResponseData: IAppActionResponse<TData> =
    requestWorkers.responseMapper(data as ICuppcakeEndpointResponse);

  if (!isArray && !formattedResponseData.result?.data) {
    return {
      result: { data: null },
      error: createError(404, 'Data not found', finalUrl, 'GET'),
    };
  }

  return formattedResponseData;
};

export const abstractMutateAction = async <TBody, TData = unknown>(
  {
    url,
    params = { method: 'POST', body: undefined as TBody },
    json = true,
    isPublic = false,
    authMode,
    onOk,
  }: IMutateActionOptions<TBody> & { url: string },
  requestWorkers: IActionRequestWorkers,
): Promise<IAppActionResponse<TData>> => {
  resolveAuthMode(isPublic, authMode);
  const requestFetcher: TAppFetcher =
    requestWorkers.fetcher ?? productCatalogFetcher;

  const res = await requestFetcher({
    url,
    params: params as IHttpParams<BodyInit | null | undefined>,
    json,
    isPublic,
    authMode,
  });

  const errorResult = await ErrorObjectSetup(res, requestWorkers.responseMapper);

  if (errorResult?.error) {
    return errorResult as IAppActionResponse<TData>;
  }

  onOk?.();

  const data: unknown = requestWorkers.streamResponseParser
    ? await requestWorkers.streamResponseParser(res)
    : await res.json();

  return requestWorkers.responseMapper(
    data as ICuppcakeEndpointResponse,
  ) as IAppActionResponse<TData>;
};
