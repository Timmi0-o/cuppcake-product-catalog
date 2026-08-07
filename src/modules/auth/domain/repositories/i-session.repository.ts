import type { TransactionScope } from '@shared/domain/transactions';
import type { ICreateSessionInput, ISessionEntity } from '../entities/session';

export interface ISessionRepository {
  create(
    input: ICreateSessionInput,
    scope?: TransactionScope,
  ): Promise<ISessionEntity>;
}

export const SESSION_REPOSITORY_TOKEN = Symbol('ISessionRepository');
