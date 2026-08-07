export interface IAppActionResponseMeta {
  total: number;
  totalCount: number;
  limit: number;
  page: number;
  offset?: number;
}

export interface IAppActionResponseResult<T> {
  data: T | null;
  meta?: IAppActionResponseMeta;
}

export interface IAppActionResponseError {
  statusCode: number;
  message: string;
  timestamp: string;
  code?: string;
}

export interface IAppActionResponse<T> {
  result: IAppActionResponseResult<T> | null;
  error: IAppActionResponseError | null;
}
