import { DomainError } from '@shared/domain/errors';

export class ProductCollectionNotFoundError extends DomainError {
  constructor(collectionId: string) {
    super(
      'PRODUCT_COLLECTION_NOT_FOUND',
      `Product collection not found: ${collectionId}`,
      { collectionId },
    );
  }
}
