import { ProductNotFoundError } from '../../../domain/entities/product';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IDeleteProductApplicationInput } from '../../dtos/product.dtos';

export class DeleteProductUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    input: IDeleteProductApplicationInput,
  ): Promise<{ success: true }> {
    const existing = await this.productRepository.findById(input.productId);
    if (!existing) {
      throw new ProductNotFoundError(input.productId);
    }

    await this.transactionManager.runInTransaction(async (scope) => {
      await this.productRepository.softDelete(input.productId, scope);
    });

    return { success: true };
  }
}
