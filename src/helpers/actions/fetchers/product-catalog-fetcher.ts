import { getRequestHeaders } from '@/actions/utils/get-request-headers';
import type { IAppFetcher, TAppFetcherAuthMode } from './i-app-fetcher';

export interface INextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

export interface IHttpParams<
  T extends BodyInit | null | undefined | unknown = unknown,
> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: T;
  cache?: RequestCache;
  next?: INextFetchRequestConfig;
}

const resolveAuthMode = (
  publicOption: boolean | undefined,
  authMode: TAppFetcherAuthMode | undefined,
): TAppFetcherAuthMode => {
  if (authMode) {
    return authMode;
  }

  return publicOption ? 'none' : 'required';
};

export const productCatalogFetcher = async <
  T extends BodyInit | null | undefined = BodyInit | null | undefined,
>({
  url,
  params,
  json = true,
  isPublic = false,
  authMode,
}: IAppFetcher<T>) => {
  const requestHeaders = await getRequestHeaders();
  const absoluteUrl = url.startsWith('http')
    ? url
    : `${requestHeaders.origin}${url}`;

  let opts: RequestInit;

  if (json) {
    const stringifiedBody = params.body
      ? JSON.stringify(params.body)
      : undefined;

    opts = {
      method: params.method,
      cache: params.cache,
      next: params.next,
      ...(stringifiedBody ? { body: stringifiedBody as BodyInit } : {}),
      headers: {
        ...(params.headers || {}),
        ...(params.body ? { 'Content-Type': 'application/json' } : {}),
        ...requestHeaders,
      },
    };
  } else {
    opts = {
      method: params.method,
      cache: params.cache,
      next: params.next,
      body: params.body as BodyInit | null | undefined,
      headers: {
        ...(params.headers || {}),
        ...requestHeaders,
      },
    };
  }

  return fetch(absoluteUrl, opts);
};
