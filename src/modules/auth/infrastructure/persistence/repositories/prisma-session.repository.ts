import type { PrismaClient, Session } from '@prisma/client';
import type {
  ICreateSessionInput,
  ISessionEntity,
} from '@modules/auth/domain/entities/session';
import type { ISessionRepository } from '@modules/auth/domain/repositories/i-session.repository';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';

function mapSessionRow(row: Session): ISessionEntity {
  return {
    id: row.id,
    userId: row.userId,
    ipAddress: row.ipAddress,
    userAgent: row.userAgent,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaSessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private client(scope?: TransactionScope) {
    return scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
  }

  async create(
    input: ICreateSessionInput,
    scope?: TransactionScope,
  ): Promise<ISessionEntity> {
    const row = await this.client(scope).session.create({
      data: {
        userId: input.userId,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
    return mapSessionRow(row);
  }
}
