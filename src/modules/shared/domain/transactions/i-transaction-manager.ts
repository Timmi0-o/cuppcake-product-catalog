import type { TransactionScope } from './transaction-scope';

export interface ITransactionManager {
  runInTransaction<T>(
    work: (scope: TransactionScope) => Promise<T>,
  ): Promise<T>;
}

export const TRANSACTION_MANAGER_TOKEN = Symbol('ITransactionManager');
