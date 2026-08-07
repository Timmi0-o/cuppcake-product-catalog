export type ISlice = {
  limit: number;
  offset: number;
};

export type FindManyParams = {
  where?: Record<string, unknown>;
  slice?: Partial<ISlice>;
  orderBy?: Array<Record<string, 'asc' | 'desc'>>;
  includeImages?: boolean;
};

export type FindManyResult<T> = {
  items: T[];
  total: number;
};
