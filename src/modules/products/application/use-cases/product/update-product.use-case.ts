import { CategoryNotFoundError } from '../../../domain/entities/category';
import { MeasurementUnitNotFoundError } from '../../../domain/entities/measurement-unit';
import { ProductCollectionNotFoundError } from '../../../domain/entities/product-collection';
import {
  ProductNotFoundError,
  type IProductPublicEntity,
} from '../../../domain/entities/product';
import type { ICategoryRepository } from '../../../domain/repositories/category/i-category.repository';
import type { IMeasurementUnitRepository } from '../../../domain/repositories/measurement-unit/i-measurement-unit.repository';
import type { IProductCollectionRepository } from '../../../domain/repositories/product-collection/i-product-collection.repository';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IUpdateProductApplicationInput } from '../../dtos/product.dtos';

export class UpdateProductUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly measurementUnitRepository: IMeasurementUnitRepository,
    private readonly productCollectionRepository: IProductCollectionRepository,
  ) {}

  async execute(
    input: IUpdateProductApplicationInput,
  ): Promise<IProductPublicEntity> {
    const existing = await this.productRepository.findByIdOrSlug(
      input.productIdOrSlug,
    );
    if (!existing) {
      throw new ProductNotFoundError(input.productIdOrSlug);
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

    if (input.collectionIds && input.collectionIds.length > 0) {
      const collections = await this.productCollectionRepository.findByIds(
        input.collectionIds,
      );
      if (collections.length !== input.collectionIds.length) {
        const found = new Set(collections.map((item) => item.id));
        const missing = input.collectionIds.find((id) => !found.has(id));
        throw new ProductCollectionNotFoundError(missing ?? 'unknown');
      }
    }

    return this.transactionManager.runInTransaction(async (scope) => {
      await this.productRepository.update(
        existing.id,
        {
          name: input.name,
          slug: input.slug,
          description: input.description,
          note: input.note,
          manualKkal: input.manualKkal,
          nutritionalInfo: input.nutritionalInfo,
          price: input.price,
          priceVariants: input.priceVariants,
          measurementUnitId: input.measurementUnitId,
          categoryIds: input.categoryIds,
          collectionIds: input.collectionIds,
        },
        scope,
      );

      const product = await this.productRepository.findPublicByIdOrSlug(
        existing.id,
        { includeImages: true },
      );
      return product!;
    });
  }
}
