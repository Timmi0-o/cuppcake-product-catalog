import { DomainError } from '@shared/domain/errors';

export class ProductNotFoundError extends DomainError {
  constructor(productIdOrSlug: string) {
    super('PRODUCT_NOT_FOUND', `Product not found: ${productIdOrSlug}`, {
      productIdOrSlug,
    });
  }
}

export class ProductSlugAlreadyExistsError extends DomainError {
  constructor(slug: string) {
    super('PRODUCT_SLUG_ALREADY_EXISTS', `Product slug already exists: ${slug}`, {
      slug,
    });
  }
}

export class InvalidProductSlugError extends DomainError {
  constructor(name: string) {
    super(
      'INVALID_PRODUCT_SLUG',
      `Cannot build product slug from name: ${name}`,
      { name },
    );
  }
}
