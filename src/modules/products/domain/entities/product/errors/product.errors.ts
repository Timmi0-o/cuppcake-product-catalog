import { DomainError } from '@shared/domain/errors';

export class ProductNotFoundError extends DomainError {
  constructor(productId: string) {
    super('PRODUCT_NOT_FOUND', `Product not found: ${productId}`, {
      productId,
    });
  }
}
