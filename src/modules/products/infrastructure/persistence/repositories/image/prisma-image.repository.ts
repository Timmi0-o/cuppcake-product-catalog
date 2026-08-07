import type { Image as PrismaImage, PrismaClient } from '@prisma/client';
import type {
  ICreateImageInput,
  IImageEntity,
  ImageEntityType,
} from '@modules/products/domain/entities/image';
import type { IImageRepository } from '@modules/products/domain/repositories/image/i-image.repository';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';

function mapImageRow(row: PrismaImage): IImageEntity {
  return {
    id: row.id,
    entityType: row.entityType as ImageEntityType,
    entityId: row.entityId,
    fileId: row.fileId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaImageRepository implements IImageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private client(scope?: TransactionScope) {
    return scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
  }

  async createMany(
    inputs: ICreateImageInput[],
    scope?: TransactionScope,
  ): Promise<IImageEntity[]> {
    const client = this.client(scope);
    const created: IImageEntity[] = [];
    for (const input of inputs) {
      const row = await client.image.create({
        data: {
          entityType: input.entityType,
          entityId: input.entityId,
          fileId: input.fileId,
        },
      });
      created.push(mapImageRow(row));
    }
    return created;
  }

  async countByEntity(
    entityType: ImageEntityType,
    entityId: string,
  ): Promise<number> {
    return this.prisma.image.count({
      where: {
        entityType,
        entityId,
        file: { deletedAt: null },
      },
    });
  }

  async findByEntityAndFileIds(
    entityType: ImageEntityType,
    entityId: string,
    fileIds: string[],
  ): Promise<IImageEntity[]> {
    if (fileIds.length === 0) {
      return [];
    }
    const rows = await this.prisma.image.findMany({
      where: {
        entityType,
        entityId,
        fileId: { in: fileIds },
      },
    });
    return rows.map(mapImageRow);
  }

  async deleteByEntityAndFileIds(
    entityType: ImageEntityType,
    entityId: string,
    fileIds: string[],
    scope?: TransactionScope,
  ): Promise<void> {
    if (fileIds.length === 0) {
      return;
    }
    await this.client(scope).image.deleteMany({
      where: {
        entityType,
        entityId,
        fileId: { in: fileIds },
      },
    });
  }
}
