import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateProductCollectionInput,
  IProductCollectionEntity,
  IProductCollectionPublicEntity,
} from '../../entities/product-collection';

export interface IProductCollectionRepository {
  findManyPublic(): Promise<IProductCollectionPublicEntity[]>;
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
