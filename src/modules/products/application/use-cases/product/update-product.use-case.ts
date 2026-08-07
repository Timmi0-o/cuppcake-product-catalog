import { ProductNotFoundError } from '../../../domain/entities/product';
import type { IProductPublicEntity } from '../../../domain/entities/product';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IUpdateProductApplicationInput } from '../../dtos/product.dtos';

export class UpdateProductUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    input: IUpdateProductApplicationInput,
  ): Promise<IProductPublicEntity> {
    const existing = await this.productRepository.findById(input.productId);
    if (!existing) {
      throw new ProductNotFoundError(input.productId);
    }

    return this.transactionManager.runInTransaction(async (scope) => {
      const product = await this.productRepository.update(
        input.productId,
        {
          name: input.name,
          description: input.description,
          manualKkal: input.manualKkal,
          nutritionalInfo: input.nutritionalInfo,
        },
        scope,
      );

      const withImages = await this.productRepository.findPublicById(
        product.id,
        { includeImages: true },
      );

      return withImages ?? {
        id: product.id,
        name: product.name,
        description: product.description,
        manualKkal: product.manualKkal,
        nutritionalInfo: product.nutritionalInfo,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });
  }
}
