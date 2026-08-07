import type { ICategoryPublicEntity } from '../../../domain/entities/category';
import type { ICategoryRepository } from '../../../domain/repositories/category/i-category.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { ICreateCategoryApplicationInput } from '../../dtos/product.dtos';

export class CreateCategoryUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(
    input: ICreateCategoryApplicationInput,
  ): Promise<ICategoryPublicEntity> {
    return this.transactionManager.runInTransaction(async (scope) => {
      const category = await this.categoryRepository.create(
        {
          name: input.name,
          slug: input.slug,
          sortOrder: input.sortOrder,
        },
        scope,
      );
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        sortOrder: category.sortOrder,
      };
    });
  }
}
