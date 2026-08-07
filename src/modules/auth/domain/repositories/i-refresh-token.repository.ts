import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateRefreshTokenInput,
  IRefreshTokenEntity,
} from '../entities/refresh-token';

export interface IRefreshTokenRepository {
  create(
    input: ICreateRefreshTokenInput,
    scope?: TransactionScope,
  ): Promise<IRefreshTokenEntity>;
  findValidByTokenHash(tokenHash: string): Promise<IRefreshTokenEntity | null>;
  revokeByTokenHash(tokenHash: string, scope?: TransactionScope): Promise<void>;
  revokeAllForUser(userId: string, scope?: TransactionScope): Promise<void>;
}

export const REFRESH_TOKEN_REPOSITORY_TOKEN = Symbol('IRefreshTokenRepository');
