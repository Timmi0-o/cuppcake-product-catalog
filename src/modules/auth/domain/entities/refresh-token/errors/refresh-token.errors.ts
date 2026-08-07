import { DomainError } from '@shared/domain/errors';

export class RefreshTokenInvalidError extends DomainError {
  constructor(message = 'Refresh token is invalid or expired') {
    super('REFRESH_TOKEN_INVALID', message);
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('INVALID_CREDENTIALS', 'Invalid email or password');
  }
}
