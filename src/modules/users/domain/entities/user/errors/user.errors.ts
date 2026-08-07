import { DomainError } from '@shared/domain/errors';

export class UserNotFoundError extends DomainError {
  constructor(userIdOrEmail: string) {
    super('USER_NOT_FOUND', `User not found: ${userIdOrEmail}`, {
      userIdOrEmail,
    });
  }
}

export class UserEmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super('USER_EMAIL_ALREADY_EXISTS', `Email already registered: ${email}`, {
      email,
    });
  }
}
