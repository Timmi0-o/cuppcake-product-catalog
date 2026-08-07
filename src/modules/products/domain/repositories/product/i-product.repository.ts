import type { FindManyParams, FindManyResult } from '@shared/domain/query';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateProductInput,
  IProductEntity,
  IProductPublicEntity,
  IUpdateProductInput,
} from '../../entities/product';

export interface IProductRepository {
  create(
    input: ICreateProductInput,
    scope?: TransactionScope,
  ): Promise<IProductEntity>;
  update(
    id: string,
    input: IUpdateProductInput,
    scope?: TransactionScope,
  ): Promise<IProductEntity>;
  softDelete(id: string, scope?: TransactionScope): Promise<void>;
  findById(id: string): Promise<IProductEntity | null>;
  findPublicById(
    id: string,
    options?: { includeImages?: boolean },
  ): Promise<IProductPublicEntity | null>;
  findMany(
    params: FindManyParams,
  ): Promise<FindManyResult<IProductPublicEntity>>;
}

export const PRODUCT_REPOSITORY_TOKEN = Symbol('IProductRepository');
