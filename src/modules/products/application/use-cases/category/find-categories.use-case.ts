import type { ICategoryPublicEntity } from '../../../domain/entities/category';
import type { ICategoryRepository } from '../../../domain/repositories/category/i-category.repository';

export class FindCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(): Promise<ICategoryPublicEntity[]> {
    return this.categoryRepository.findManyPublic();
  }
}
