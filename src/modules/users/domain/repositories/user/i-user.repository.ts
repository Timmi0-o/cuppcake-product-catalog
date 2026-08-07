import type { TransactionScope } from '@shared/domain/transactions';
import type { ICreateUserInput, IUserEntity, IUserPublicEntity } from '../../entities/user';

export interface IUserRepository {
  findById(id: string): Promise<IUserEntity | null>;
  findPublicById(id: string): Promise<IUserPublicEntity | null>;
  findByEmail(email: string): Promise<IUserEntity | null>;
  create(input: ICreateUserInput, scope?: TransactionScope): Promise<IUserEntity>;
}

export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');
