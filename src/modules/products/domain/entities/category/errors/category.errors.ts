import { DomainError } from '@shared/domain/errors';

export class CategoryNotFoundError extends DomainError {
  constructor(categoryId: string) {
    super('CATEGORY_NOT_FOUND', `Category not found: ${categoryId}`, {
      categoryId,
    });
  }
}

export class CategorySlugAlreadyExistsError extends DomainError {
  constructor(slug: string) {
    super('CATEGORY_SLUG_ALREADY_EXISTS', `Category slug exists: ${slug}`, {
      slug,
    });
  }
}
