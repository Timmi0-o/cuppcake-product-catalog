import type { IProductCollectionPublicEntity } from '../../../domain/entities/product-collection';
import type { IProductCollectionRepository } from '../../../domain/repositories/product-collection/i-product-collection.repository';

export class FindProductCollectionsUseCase {
  constructor(
    private readonly productCollectionRepository: IProductCollectionRepository,
  ) {}

  async execute(): Promise<IProductCollectionPublicEntity[]> {
    return this.productCollectionRepository.findManyPublic();
  }
}
