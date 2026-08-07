import type { PrismaClient } from '@prisma/client';
import type { ICreateUserInput, IUserEntity, IUserPublicEntity } from '@modules/users/domain/entities/user';
import { UserEmailAlreadyExistsError } from '@modules/users/domain/entities/user';
import type { IUserRepository } from '@modules/users/domain/repositories/user';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import { Prisma } from '@prisma/client';
import { mapUserPublicRow, mapUserRow } from '../../row-mappers/user/map-user-row';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private client(scope?: TransactionScope) {
    return scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
  }

  async findById(id: string): Promise<IUserEntity | null> {
    const row = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? mapUserRow(row) : null;
  }

  async findPublicById(id: string): Promise<IUserPublicEntity | null> {
    const row = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? mapUserPublicRow(row) : null;
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    const row = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase(), deletedAt: null },
    });
    return row ? mapUserRow(row) : null;
  }

  async create(
    input: ICreateUserInput,
    scope?: TransactionScope,
  ): Promise<IUserEntity> {
    try {
      const row = await this.client(scope).user.create({
        data: {
          email: input.email.toLowerCase(),
          passwordHash: input.passwordHash,
        },
      });
      return mapUserRow(row);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UserEmailAlreadyExistsError(input.email);
      }
      throw error;
    }
  }
}
