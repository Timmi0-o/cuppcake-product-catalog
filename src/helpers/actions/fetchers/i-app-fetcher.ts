import type { IHttpParams } from './product-catalog-fetcher';

export type TAppFetcherAuthMode = 'required' | 'optional' | 'none';

export interface IAppFetcher<
  T extends BodyInit | null | undefined = BodyInit | null | undefined,
> {
  url: string;
  params: IHttpParams<T>;
  json?: boolean;
  isPublic?: boolean;
  authMode?: TAppFetcherAuthMode;
}

export type TAppFetcher<
  T extends BodyInit | null | undefined = BodyInit | null | undefined,
> = (args: IAppFetcher<T>) => Promise<Response>;
