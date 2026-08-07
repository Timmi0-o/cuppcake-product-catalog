import { ProductNotFoundError } from '../../../domain/entities/product';
import type { IProductPublicEntity } from '../../../domain/entities/product';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { IGetProductByIdApplicationInput } from '../../dtos/product.dtos';

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(
    input: IGetProductByIdApplicationInput,
  ): Promise<IProductPublicEntity> {
    const product = await this.productRepository.findPublicByIdOrSlug(
      input.productIdOrSlug,
      { includeImages: input.includeImages ?? true },
    );
    if (!product) {
      throw new ProductNotFoundError(input.productIdOrSlug);
    }
    return product;
  }
}
