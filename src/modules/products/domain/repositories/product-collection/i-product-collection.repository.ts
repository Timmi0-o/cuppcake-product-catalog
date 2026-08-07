import type { FindManyParams, FindManyResult } from '@shared/domain/query';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateProductCollectionInput,
  IProductCollectionEntity,
  IProductCollectionPublicEntity,
} from '../../entities/product-collection';

export interface IProductCollectionRepository {
  findManyPublic(
    params?: Pick<FindManyParams, 'slice'>,
  ): Promise<FindManyResult<IProductCollectionPublicEntity>>;
  findById(id: string): Promise<IProductCollectionEntity | null>;
  findByIds(ids: string[]): Promise<IProductCollectionEntity[]>;
  create(
    input: ICreateProductCollectionInput,
    scope?: TransactionScope,
  ): Promise<IProductCollectionEntity>;
}

export const PRODUCT_COLLECTION_REPOSITORY_TOKEN = Symbol(
  'IProductCollectionRepository',
);
