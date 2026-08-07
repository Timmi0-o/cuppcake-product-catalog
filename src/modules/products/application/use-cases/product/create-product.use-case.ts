import type { ITransactionManager } from '@shared/domain/transactions';
import type { IProductPublicEntity } from '../../../domain/entities/product';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { ICreateProductApplicationInput } from '../../dtos/product.dtos';

export class CreateProductUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    input: ICreateProductApplicationInput,
  ): Promise<IProductPublicEntity> {
    return this.transactionManager.runInTransaction(async (scope) => {
      const product = await this.productRepository.create(
        {
          name: input.name,
          description: input.description,
          manualKkal: input.manualKkal,
          nutritionalInfo: input.nutritionalInfo,
        },
        scope,
      );

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        manualKkal: product.manualKkal,
        nutritionalInfo: product.nutritionalInfo,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        images: [],
      };
    });
  }
}
