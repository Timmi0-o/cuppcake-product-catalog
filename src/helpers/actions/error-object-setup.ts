import type { ICuppcakeEndpointResponse } from '@/contracts/api-response/cuppcake-api-core';
import type { IAppActionResponseError } from '@/contracts/api-response/types';
import type { IApiResponseMapper } from '@/contracts/api-response/types/i-api-response-mapper';

export const ErrorObjectSetup = async (
  res: Response,
  responseMapper: IApiResponseMapper<ICuppcakeEndpointResponse>,
) => {
  if (!res.ok) {
    let errorData: IAppActionResponseError;

    try {
      const errorResponse: ICuppcakeEndpointResponse = await res.json();
      const formattedErrorResponse = responseMapper(errorResponse)?.error;

      errorData = {
        statusCode: formattedErrorResponse?.statusCode || res.status,
        timestamp:
          formattedErrorResponse?.timestamp || new Date().toISOString(),
        message:
          formattedErrorResponse?.message || `Request error (${res.status})`,
        ...(formattedErrorResponse?.code
          ? { code: formattedErrorResponse.code }
          : {}),
      };
    } catch {
      errorData = {
        statusCode: res.status,
        timestamp: new Date().toISOString(),
        message: `Request error (${res.status})`,
      };
    }

    return { result: null, error: errorData };
  }
};
