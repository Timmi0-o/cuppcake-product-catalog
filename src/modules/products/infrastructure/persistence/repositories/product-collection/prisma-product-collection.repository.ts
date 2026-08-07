import type { PrismaClient, ProductCollection } from '@prisma/client';
import type {
  ICreateProductCollectionInput,
  IProductCollectionEntity,
  IProductCollectionPublicEntity,
} from '@modules/products/domain/entities/product-collection';
import type { IProductCollectionRepository } from '@modules/products/domain/repositories/product-collection/i-product-collection.repository';
import type { FindManyParams, FindManyResult } from '@shared/domain/query';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';

function mapRow(row: ProductCollection): IProductCollectionEntity {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}

export class PrismaProductCollectionRepository
  implements IProductCollectionRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  private client(scope?: TransactionScope) {
    return scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
  }

  async findManyPublic(
    params?: Pick<FindManyParams, 'slice'>,
  ): Promise<FindManyResult<IProductCollectionPublicEntity>> {
    const limit = params?.slice?.limit ?? 20;
    const offset = params?.slice?.offset ?? 0;
    const where = { deletedAt: null };

    const [rows, total] = await Promise.all([
      this.prisma.productCollection.findMany({
        where,
        orderBy: [{ name: 'asc' }],
        take: limit,
        skip: offset,
      }),
      this.prisma.productCollection.count({ where }),
    ]);

    return {
      items: rows.map((row) => ({ id: row.id, name: row.name })),
      total,
    };
  }

  async findById(id: string): Promise<IProductCollectionEntity | null> {
    const row = await this.prisma.productCollection.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? mapRow(row) : null;
  }

  async findByIds(ids: string[]): Promise<IProductCollectionEntity[]> {
    if (ids.length === 0) return [];
    const rows = await this.prisma.productCollection.findMany({
      where: { id: { in: ids }, deletedAt: null },
    });
    return rows.map(mapRow);
  }

  async create(
    input: ICreateProductCollectionInput,
    scope?: TransactionScope,
  ): Promise<IProductCollectionEntity> {
    const row = await this.client(scope).productCollection.create({
      data: { name: input.name },
    });
    return mapRow(row);
  }
}
