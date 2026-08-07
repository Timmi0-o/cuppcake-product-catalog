import type { TAppFetcherAuthMode } from '@/helpers/actions/fetchers/i-app-fetcher';
import type { IHttpParams } from '@/helpers/actions/fetchers/product-catalog-fetcher';

interface IBaseActionOptions {
  url: string;
  params?: IHttpParams;
}

export type IActionFilters<T> = Partial<T>;

export interface IGetActionOptions<TFilters = Record<string, unknown>>
  extends Partial<IBaseActionOptions> {
  filters?: IActionFilters<TFilters>;
  customFormatter?: (
    filters: IActionFilters<TFilters>,
  ) => Record<string, string> | undefined;
  isArray?: boolean;
  isPublic?: boolean;
  authMode?: TAppFetcherAuthMode;
}

export interface IMutateActionOptions<T> extends IBaseActionOptions {
  params?: IHttpParams & { body?: T };
  json?: boolean;
  onOk?: () => void | Promise<void>;
  isPublic?: boolean;
  authMode?: TAppFetcherAuthMode;
}
