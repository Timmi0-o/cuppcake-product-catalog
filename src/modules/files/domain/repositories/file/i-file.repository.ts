import type { TransactionScope } from '@shared/domain/transactions';
import type { ICreateFileInput, IFileEntity } from '../../entities/file';

export interface IFileRepository {
  createMany(
    inputs: ICreateFileInput[],
    scope?: TransactionScope,
  ): Promise<IFileEntity[]>;
  findByIds(ids: string[]): Promise<IFileEntity[]>;
  softDeleteMany(ids: string[], scope?: TransactionScope): Promise<void>;
}

export const FILE_REPOSITORY_TOKEN = Symbol('IFileRepository');
