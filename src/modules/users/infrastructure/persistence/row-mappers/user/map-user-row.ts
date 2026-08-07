import type { User } from '@prisma/client';
import type { IUserEntity, IUserPublicEntity } from '@modules/users/domain/entities/user';

export type UserRow = User;

export function mapUserRow(row: UserRow): IUserEntity {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}

export function mapUserPublicRow(row: UserRow): IUserPublicEntity {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
