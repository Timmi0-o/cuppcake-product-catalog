import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICategoryEntity,
  ICategoryPublicEntity,
  ICreateCategoryInput,
} from '../../entities/category';

export interface ICategoryRepository {
  findManyPublic(): Promise<ICategoryPublicEntity[]>;
  findById(id: string): Promise<ICategoryEntity | null>;
  findBySlug(slug: string): Promise<ICategoryEntity | null>;
  findByIds(ids: string[]): Promise<ICategoryEntity[]>;
  create(
    input: ICreateCategoryInput,
    scope?: TransactionScope,
  ): Promise<ICategoryEntity>;
}

export const CATEGORY_REPOSITORY_TOKEN = Symbol('ICategoryRepository');
