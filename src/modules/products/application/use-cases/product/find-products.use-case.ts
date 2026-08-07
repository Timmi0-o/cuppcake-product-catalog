import { CategoryNotFoundError } from '../../../domain/entities/category';
import { mapPaginationToSlice, type FindManyResult } from '@shared/domain/query';
import type { IProductPublicEntity } from '../../../domain/entities/product';
import type { ICategoryRepository } from '../../../domain/repositories/category/i-category.repository';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { IFindProductsApplicationInput } from '../../dtos/product.dtos';

export class FindProductsUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(
    input: IFindProductsApplicationInput,
  ): Promise<FindManyResult<IProductPublicEntity>> {
    let categoryId = input.categoryId;

    if (input.categorySlug) {
      const category = await this.categoryRepository.findBySlug(
        input.categorySlug,
      );
      if (!category) {
        throw new CategoryNotFoundError(input.categorySlug);
      }
      categoryId = category.id;
    }

    const search = input.search?.trim() || undefined;

    return this.productRepository.findMany({
      where: {
        ...(input.name ? { name: input.name } : {}),
        ...(search ? { search } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(input.collectionId ? { collectionId: input.collectionId } : {}),
      },
      slice: mapPaginationToSlice({
        page: input.page,
        limit: input.limit,
      }),
      includeImages: input.includeImages ?? true,
    });
  }
}
