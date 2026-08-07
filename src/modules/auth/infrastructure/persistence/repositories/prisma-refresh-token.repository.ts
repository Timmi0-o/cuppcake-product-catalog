import type { PrismaClient, RefreshToken } from '@prisma/client';
import type {
  ICreateRefreshTokenInput,
  IRefreshTokenEntity,
} from '@modules/auth/domain/entities/refresh-token';
import type { IRefreshTokenRepository } from '@modules/auth/domain/repositories/i-refresh-token.repository';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';

function mapRefreshTokenRow(row: RefreshToken): IRefreshTokenEntity {
  return {
    id: row.id,
    userId: row.userId,
    tokenHash: row.tokenHash,
    expiresAt: row.expiresAt,
    revokedAt: row.revokedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private client(scope?: TransactionScope) {
    return scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
  }

  async create(
    input: ICreateRefreshTokenInput,
    scope?: TransactionScope,
  ): Promise<IRefreshTokenEntity> {
    const row = await this.client(scope).refreshToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
      },
    });
    return mapRefreshTokenRow(row);
  }

  async findValidByTokenHash(
    tokenHash: string,
  ): Promise<IRefreshTokenEntity | null> {
    const row = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    return row ? mapRefreshTokenRow(row) : null;
  }

  async revokeByTokenHash(
    tokenHash: string,
    scope?: TransactionScope,
  ): Promise<void> {
    await this.client(scope).refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(
    userId: string,
    scope?: TransactionScope,
  ): Promise<void> {
    await this.client(scope).refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
