import { DomainError } from '@shared/domain/errors';
import { ZodError } from 'zod';
import { jsonError } from './json-result';

const DOMAIN_STATUS_BY_CODE: Record<string, number> = {
  USER_NOT_FOUND: 404,
  USER_EMAIL_ALREADY_EXISTS: 409,
  INVALID_CREDENTIALS: 401,
  REFRESH_TOKEN_INVALID: 401,
  UNAUTHENTICATED: 401,
  PRODUCT_NOT_FOUND: 404,
  CATEGORY_NOT_FOUND: 404,
  PRODUCT_COLLECTION_NOT_FOUND: 404,
  CATEGORY_SLUG_ALREADY_EXISTS: 409,
  MEASUREMENT_UNIT_NOT_FOUND: 404,
  FILE_NOT_FOUND: 404,
  IMAGE_MAX_COUNT_EXCEEDED: 422,
  INVALID_FILE_TYPE: 400,
  FILE_TOO_LARGE: 400,
  VALIDATION_ERROR: 400,
};

export function mapDomainErrorToHttp(error: DomainError): Response {
  const statusCode = DOMAIN_STATUS_BY_CODE[error.code] ?? 422;
  return jsonError(statusCode, error.message, error.code);
}

export function handleRouteError(error: unknown): Response {
  if (error instanceof DomainError) {
    return mapDomainErrorToHttp(error);
  }

  if (error instanceof ZodError) {
    return jsonError(400, error.issues[0]?.message ?? 'Validation failed', 'VALIDATION_ERROR');
  }

  console.error(error);
  return jsonError(500, 'Internal server error');
}
