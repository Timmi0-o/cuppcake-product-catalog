import { CategoryNotFoundError } from '../../../domain/entities/category';
import { MeasurementUnitNotFoundError } from '../../../domain/entities/measurement-unit';
import type { IProductPublicEntity } from '../../../domain/entities/product';
import type { ICategoryRepository } from '../../../domain/repositories/category/i-category.repository';
import type { IMeasurementUnitRepository } from '../../../domain/repositories/measurement-unit/i-measurement-unit.repository';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { ICreateProductApplicationInput } from '../../dtos/product.dtos';

export class CreateProductUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly measurementUnitRepository: IMeasurementUnitRepository,
  ) {}

  async execute(
    input: ICreateProductApplicationInput,
  ): Promise<IProductPublicEntity> {
    const unit = await this.measurementUnitRepository.findById(
      input.measurementUnitId,
    );
    if (!unit) {
      throw new MeasurementUnitNotFoundError(input.measurementUnitId);
    }

    if (input.categoryIds.length > 0) {
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
      const created = await this.productRepository.create(
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

      const product = await this.productRepository.findPublicById(created.id, {
        includeImages: true,
      });
      return product!;
    });
  }
}
