import type {
  ITransactionManager,
  TransactionScope,
} from '@shared/domain/transactions';
import type { PrismaClient } from '@prisma/client';
import { wrapPrismaTxAsScope } from './prisma-transaction-scope';

export class PrismaTransactionManager implements ITransactionManager {
  constructor(private readonly prisma: PrismaClient) {}

  async runInTransaction<T>(
    work: (scope: TransactionScope) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) =>
      work(wrapPrismaTxAsScope(tx)),
    );
  }
}
