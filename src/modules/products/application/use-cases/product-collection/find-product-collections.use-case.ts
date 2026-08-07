import { mapPaginationToSlice, type FindManyResult } from '@shared/domain/query';
import type { IProductCollectionPublicEntity } from '../../../domain/entities/product-collection';
import type { IProductCollectionRepository } from '../../../domain/repositories/product-collection/i-product-collection.repository';
import type { IFindProductCollectionsApplicationInput } from '../../dtos/product.dtos';

export class FindProductCollectionsUseCase {
  constructor(
    private readonly productCollectionRepository: IProductCollectionRepository,
  ) {}

  async execute(
    input: IFindProductCollectionsApplicationInput = {},
  ): Promise<FindManyResult<IProductCollectionPublicEntity>> {
    return this.productCollectionRepository.findManyPublic({
      slice: mapPaginationToSlice({
        page: input.page,
        limit: input.limit,
      }),
    });
  }
}
