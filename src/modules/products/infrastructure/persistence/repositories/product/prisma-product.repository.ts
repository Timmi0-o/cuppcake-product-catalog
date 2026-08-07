import type { Prisma, PrismaClient, Product } from '@prisma/client';
import type {
  ICreateProductInput,
  INutritionalInfo,
  IProductEntity,
  IProductImagePublic,
  IProductPublicEntity,
  IUpdateProductInput,
} from '@modules/products/domain/entities/product';
import type { IProductRepository } from '@modules/products/domain/repositories/product/i-product.repository';
import type { FindManyParams, FindManyResult } from '@shared/domain/query';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';

function parseNutritionalInfo(value: Prisma.JsonValue): INutritionalInfo {
  const obj = value as Record<string, unknown>;
  return {
    protein: Number(obj.protein ?? 0),
    fats: Number(obj.fats ?? 0),
    carbohydrates: Number(obj.carbohydrates ?? 0),
  };
}

function mapProductRow(row: Product): IProductEntity {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    manualKkal: row.manualKkal.toString(),
    nutritionalInfo: parseNutritionalInfo(row.nutritionalInfo),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}

function mapProductPublic(
  row: Product,
  images?: IProductImagePublic[],
): IProductPublicEntity {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    manualKkal: row.manualKkal.toString(),
    nutritionalInfo: parseNutritionalInfo(row.nutritionalInfo),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    ...(images ? { images } : {}),
  };
}

async function loadProductImages(
  prisma: PrismaClient,
  productId: string,
): Promise<IProductImagePublic[]> {
  const rows = await prisma.image.findMany({
    where: {
      entityType: 'PRODUCT',
      entityId: productId,
      file: { deletedAt: null },
    },
    include: { file: true },
    orderBy: { createdAt: 'asc' },
  });

  return rows.map((row) => ({
    id: row.id,
    fileId: row.fileId,
    fileUrl: row.file.fileUrl,
    originalName: row.file.originalName,
    mimeType: row.file.mimeType,
    status: row.file.status,
    fileSize: row.file.fileSize.toString(),
    createdAt: row.createdAt,
  }));
}

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private client(scope?: TransactionScope) {
    return scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
  }

  async create(
    input: ICreateProductInput,
    scope?: TransactionScope,
  ): Promise<IProductEntity> {
    const row = await this.client(scope).product.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        manualKkal: input.manualKkal,
        nutritionalInfo: input.nutritionalInfo,
      },
    });
    return mapProductRow(row);
  }

  async update(
    id: string,
    input: IUpdateProductInput,
    scope?: TransactionScope,
  ): Promise<IProductEntity> {
    const data: Prisma.ProductUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.manualKkal !== undefined) data.manualKkal = input.manualKkal;
    if (input.nutritionalInfo !== undefined) {
      data.nutritionalInfo = input.nutritionalInfo;
    }

    const row = await this.client(scope).product.update({
      where: { id },
      data,
    });
    return mapProductRow(row);
  }

  async softDelete(id: string, scope?: TransactionScope): Promise<void> {
    await this.client(scope).product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findById(id: string): Promise<IProductEntity | null> {
    const row = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? mapProductRow(row) : null;
  }

  async findPublicById(
    id: string,
    options?: { includeImages?: boolean },
  ): Promise<IProductPublicEntity | null> {
    const row = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) {
      return null;
    }
    const images = options?.includeImages
      ? await loadProductImages(this.prisma, id)
      : undefined;
    return mapProductPublic(row, images);
  }

  async findMany(
    params: FindManyParams,
  ): Promise<FindManyResult<IProductPublicEntity>> {
    const limit = params.slice?.limit ?? 20;
    const offset = params.slice?.offset ?? 0;
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(typeof params.where?.name === 'string'
        ? { name: { contains: params.where.name, mode: 'insensitive' } }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: params.orderBy ?? [{ createdAt: 'desc' }],
      }),
      this.prisma.product.count({ where }),
    ]);

    const items: IProductPublicEntity[] = [];
    for (const row of rows) {
      const images = params.includeImages
        ? await loadProductImages(this.prisma, row.id)
        : undefined;
      items.push(mapProductPublic(row, images));
    }

    return { items, total };
  }
}
