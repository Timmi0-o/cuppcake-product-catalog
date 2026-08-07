import type {
  IAppActionResponse,
  IAppActionResponseMeta,
} from '@/contracts/api-response/types';
import type { IApiResponseMapper } from '@/contracts/api-response/types/i-api-response-mapper';
import type { ICuppcakeEndpointResponse } from './types/i-cuppcake-endpoint-response.type';

const isPlainObjectWithKeys = (value: unknown): boolean =>
  value !== null &&
  value !== undefined &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.keys(value).length > 0;

export const cuppcakeEndpointResponseMapper: IApiResponseMapper<
  ICuppcakeEndpointResponse
> = <TData>(
  response: ICuppcakeEndpointResponse,
): IAppActionResponse<TData> => {
  const result = response?.result as
    | { data?: unknown; meta?: IAppActionResponseMeta }
    | unknown[]
    | null
    | undefined;

  let resultData: unknown = null;

  if (Array.isArray(result)) {
    resultData = result;
  } else if (
    result &&
    typeof result === 'object' &&
    Object.prototype.hasOwnProperty.call(result, 'data')
  ) {
    resultData = result.data === undefined ? null : result.data;
  } else if (result && isPlainObjectWithKeys(result) && !('meta' in result)) {
    resultData = result;
  }

  const resultMeta =
    result &&
    typeof result === 'object' &&
    !Array.isArray(result) &&
    result.meta
      ? result.meta
      : undefined;

  const error = response?.error
    ? {
        statusCode: response.error.statusCode,
        message: response.error.message,
        timestamp: response.error.timestamp ?? new Date().toISOString(),
        ...(response.error.code ? { code: response.error.code } : {}),
      }
    : null;

  return {
    result: {
      data: resultData as TData | null,
      ...(resultMeta ? { meta: resultMeta } : {}),
    },
    error,
  };
};
