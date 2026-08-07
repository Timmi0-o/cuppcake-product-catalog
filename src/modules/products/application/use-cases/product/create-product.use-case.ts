import { CategoryNotFoundError } from '../../../domain/entities/category';
import { MeasurementUnitNotFoundError } from '../../../domain/entities/measurement-unit';
import { ProductCollectionNotFoundError } from '../../../domain/entities/product-collection';
import {
  InvalidProductSlugError,
  type IProductPublicEntity,
} from '../../../domain/entities/product';
import type { ICategoryRepository } from '../../../domain/repositories/category/i-category.repository';
import type { IMeasurementUnitRepository } from '../../../domain/repositories/measurement-unit/i-measurement-unit.repository';
import type { IProductCollectionRepository } from '../../../domain/repositories/product-collection/i-product-collection.repository';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import { slugify } from '@/utils/slugify.util';
import type { ICreateProductApplicationInput } from '../../dtos/product.dtos';

function resolvePriceFromVariants(
  price: string,
  priceVariants: ICreateProductApplicationInput['priceVariants'],
): string {
  if (!priceVariants || priceVariants.length === 0) {
    return price;
  }

  const numericPrices = priceVariants
    .map((variant) => Number(variant.price))
    .filter((value) => Number.isFinite(value));

  if (numericPrices.length === 0) {
    return price;
  }

  return String(Math.min(...numericPrices));
}

export class CreateProductUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly measurementUnitRepository: IMeasurementUnitRepository,
    private readonly productCollectionRepository: IProductCollectionRepository,
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

    const collectionIds = input.collectionIds ?? [];
    if (collectionIds.length > 0) {
      const collections =
        await this.productCollectionRepository.findByIds(collectionIds);
      if (collections.length !== collectionIds.length) {
        const found = new Set(collections.map((item) => item.id));
        const missing = collectionIds.find((id) => !found.has(id));
        throw new ProductCollectionNotFoundError(missing ?? 'unknown');
      }
    }

    const slug = input.slug?.trim() || slugify(input.name);
    if (!slug) {
      throw new InvalidProductSlugError(input.name);
    }

    const price = resolvePriceFromVariants(input.price, input.priceVariants);

    return this.transactionManager.runInTransaction(async (scope) => {
      const created = await this.productRepository.create(
        {
          name: input.name,
          slug,
          description: input.description,
          note: input.note,
          manualKkal: input.manualKkal,
          nutritionalInfo: input.nutritionalInfo,
          price,
          priceVariants: input.priceVariants ?? null,
          measurementUnitId: input.measurementUnitId,
          categoryIds: input.categoryIds,
          collectionIds,
        },
        scope,
      );

      const product = await this.productRepository.findPublicByIdOrSlug(
        created.id,
        { includeImages: true },
        scope,
      );
      if (!product) {
        throw new Error(`Created product not found: ${created.id}`);
      }
      return product;
    });
  }
}
