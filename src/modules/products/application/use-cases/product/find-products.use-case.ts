import type { FindManyResult } from '@shared/domain/query';
import type { IProductPublicEntity } from '../../../domain/entities/product';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { IFindProductsApplicationInput } from '../../dtos/product.dtos';

export class FindProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(
    input: IFindProductsApplicationInput,
  ): Promise<FindManyResult<IProductPublicEntity>> {
    return this.productRepository.findMany({
      where: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.categoryId ? { categoryId: input.categoryId } : {}),
      },
      slice: {
        limit: input.limit ?? 48,
        offset: input.offset ?? 0,
      },
      includeImages: input.includeImages ?? true,
    });
  }
}
