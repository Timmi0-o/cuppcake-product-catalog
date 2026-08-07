import { CategoryNotFoundError } from '../../../domain/entities/category';
import { MeasurementUnitNotFoundError } from '../../../domain/entities/measurement-unit';
import {
  ProductNotFoundError,
  type IProductPublicEntity,
} from '../../../domain/entities/product';
import type { ICategoryRepository } from '../../../domain/repositories/category/i-category.repository';
import type { IMeasurementUnitRepository } from '../../../domain/repositories/measurement-unit/i-measurement-unit.repository';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IUpdateProductApplicationInput } from '../../dtos/product.dtos';

export class UpdateProductUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly measurementUnitRepository: IMeasurementUnitRepository,
  ) {}

  async execute(
    input: IUpdateProductApplicationInput,
  ): Promise<IProductPublicEntity> {
    const existing = await this.productRepository.findById(input.productId);
    if (!existing) {
      throw new ProductNotFoundError(input.productId);
    }

    if (input.measurementUnitId) {
      const unit = await this.measurementUnitRepository.findById(
        input.measurementUnitId,
      );
      if (!unit) {
        throw new MeasurementUnitNotFoundError(input.measurementUnitId);
      }
    }

    if (input.categoryIds && input.categoryIds.length > 0) {
      const categories = await this.categoryRepository.findByIds(
        input.categoryIds,
      );
      if (categories.length !== input.categoryIds.length) {
        const found = new Set(categories.map((item) => item.id));
        const missing = input.categoryIds.find((id) => !found.has(id));
        throw new CategoryNotFoundError(missing ?? 'unknown');
      }
    }

    return this.transactionManager.runInTransaction(async (scope) => {
      await this.productRepository.update(
        input.productId,
        {
          name: input.name,
          description: input.description,
          manualKkal: input.manualKkal,
          nutritionalInfo: input.nutritionalInfo,
          price: input.price,
          measurementUnitId: input.measurementUnitId,
          categoryIds: input.categoryIds,
        },
        scope,
      );

      const product = await this.productRepository.findPublicById(
        input.productId,
        { includeImages: true },
      );
      return product!;
    });
  }
}
