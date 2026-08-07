import type { IAppActionResponse } from '@/contracts/api-response/types/i-app-action-response.type';

export type IApiResponseMapper<TResponse> = <TData>(
  response: TResponse,
) => IAppActionResponse<TData>;
