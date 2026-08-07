import type { File as PrismaFile, Prisma, PrismaClient } from '@prisma/client';
import type {
  ICreateFileInput,
  IFileEntity,
} from '@modules/files/domain/entities/file';
import {
  FilePurpose,
  FileStatus,
  FileType,
} from '@modules/files/domain/entities/file';
import type { IFileRepository } from '@modules/files/domain/repositories/file';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';

function mapFileRow(row: PrismaFile): IFileEntity {
  return {
    id: row.id,
    uploadedBy: row.uploadedBy,
    fileName: row.fileName,
    originalName: row.originalName,
    mimeType: row.mimeType,
    fileSize: row.fileSize,
    fileUrl: row.fileUrl,
    checksum: row.checksum,
    status: row.status as FileStatus,
    fileType: row.fileType as FileType,
    purpose: row.purpose as FilePurpose,
    metadata:
      row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata)
        ? (row.metadata as Record<string, unknown>)
        : null,
    tags: row.tags,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}

export class PrismaFileRepository implements IFileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private client(scope?: TransactionScope) {
    return scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
  }

  async createMany(
    inputs: ICreateFileInput[],
    scope?: TransactionScope,
  ): Promise<IFileEntity[]> {
    const client = this.client(scope);
    const created: IFileEntity[] = [];
    for (const input of inputs) {
      const row = await client.file.create({
        data: {
          uploadedBy: input.uploadedBy,
          fileName: input.fileName,
          originalName: input.originalName,
          mimeType: input.mimeType,
          fileSize: input.fileSize,
          fileUrl: input.fileUrl,
          checksum: input.checksum,
          status: input.status,
          fileType: input.fileType,
          purpose: input.purpose,
          metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
          tags: input.tags ?? [],
        },
      });
      created.push(mapFileRow(row));
    }
    return created;
  }

  async findByIds(ids: string[]): Promise<IFileEntity[]> {
    if (ids.length === 0) {
      return [];
    }
    const rows = await this.prisma.file.findMany({
      where: { id: { in: ids }, deletedAt: null },
    });
    return rows.map(mapFileRow);
  }

  async softDeleteMany(
    ids: string[],
    scope?: TransactionScope,
  ): Promise<void> {
    if (ids.length === 0) {
      return;
    }
    await this.client(scope).file.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
