import {
  ProductCollectionNotFoundError,
  type IProductCollectionPublicEntity,
} from '../../../domain/entities/product-collection';
import type { IProductCollectionRepository } from '../../../domain/repositories/product-collection/i-product-collection.repository';
import type { IGetProductCollectionByIdApplicationInput } from '../../dtos/product.dtos';

export class GetProductCollectionByIdUseCase {
  constructor(
    private readonly productCollectionRepository: IProductCollectionRepository,
  ) {}

  async execute(
    input: IGetProductCollectionByIdApplicationInput,
  ): Promise<IProductCollectionPublicEntity> {
    const collection = await this.productCollectionRepository.findById(
      input.collectionId,
    );

    if (!collection) {
      throw new ProductCollectionNotFoundError(input.collectionId);
    }

    return {
      id: collection.id,
      name: collection.name,
    };
  }
}
