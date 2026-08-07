import type {
  IFindProductCollectionsApplicationInput,
  IGetProductCollectionByIdApplicationInput,
} from '@modules/products/application/dtos/product.dtos';
import type { FindProductCollectionsQuery } from '../../validation/schemas/product-collection.schemas';

export function requestQueryParamsToFindProductCollectionsUseCaseInput(
  query: FindProductCollectionsQuery,
): IFindProductCollectionsApplicationInput {
  return {
    page: query.page,
    limit: query.limit,
  };
}

export function requestParamsToGetProductCollectionByIdUseCaseInput(params: {
  id: string;
}): IGetProductCollectionByIdApplicationInput {
  return {
    collectionId: params.id,
  };
}
