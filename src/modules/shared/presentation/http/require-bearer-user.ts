import { DomainError } from '@shared/domain/errors';

export class UnauthenticatedError extends DomainError {
  constructor(message = 'Authentication required') {
    super('UNAUTHENTICATED', message);
  }
}

export type AuthenticatedActor = {
  userId: string;
  email: string;
};

export async function requireBearerUser(
  request: Request,
  verifyAccessToken: (
    token: string,
  ) => Promise<{ userId: string; email: string }>,
): Promise<AuthenticatedActor> {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    throw new UnauthenticatedError();
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    throw new UnauthenticatedError();
  }

  try {
    return await verifyAccessToken(token);
  } catch {
    throw new UnauthenticatedError('Invalid or expired access token');
  }
}
