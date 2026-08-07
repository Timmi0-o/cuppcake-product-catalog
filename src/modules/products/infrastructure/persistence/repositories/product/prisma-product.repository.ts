import { Prisma, type PrismaClient, type Product } from '@prisma/client';
import { resolveProductImageUrls } from '@modules/files/domain/entities/file';
import type {
  ICreateProductInput,
  INutritionalInfo,
  IProductCategoryPublic,
  IProductCollectionPublic,
  IProductEntity,
  IProductImagePublic,
  IProductMeasurementUnitPublic,
  IProductPriceVariant,
  IProductPublicEntity,
  IUpdateProductInput,
} from '@modules/products/domain/entities/product';
import { ProductSlugAlreadyExistsError } from '@modules/products/domain/entities/product';
import type { IProductRepository } from '@modules/products/domain/repositories/product/i-product.repository';
import type { FindManyParams, FindManyResult } from '@shared/domain/query';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';

type ProductWithRelations = Product & {
  measurementUnit: IProductMeasurementUnitPublic;
  categories: Array<{
    category: IProductCategoryPublic;
  }>;
  collections: Array<{
    productCollection: IProductCollectionPublic;
  }>;
};

function parseNutritionalInfo(value: Prisma.JsonValue): INutritionalInfo {
  const obj = value as Record<string, unknown>;
  return {
    protein: Number(obj.protein ?? 0),
    fats: Number(obj.fats ?? 0),
    carbohydrates: Number(obj.carbohydrates ?? 0),
  };
}

function parsePriceVariants(
  value: Prisma.JsonValue | null,
): IProductPriceVariant[] | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!Array.isArray(value)) {
    return null;
  }

  return value.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      volumeMl: Number(row.volumeMl ?? 0),
      price: String(row.price ?? '0'),
    };
  });
}

const productInclude = {
  measurementUnit: {
    select: { id: true, name: true, symbol: true },
  },
  categories: {
    include: {
      category: {
        select: { id: true, name: true, slug: true, parentCategoryId: true },
      },
    },
  },
  collections: {
    include: {
      productCollection: {
        select: { id: true, name: true },
      },
    },
  },
} as const;

function mapProductRow(row: Product): IProductEntity {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    note: row.note,
    manualKkal: row.manualKkal?.toString() ?? null,
    nutritionalInfo: parseNutritionalInfo(row.nutritionalInfo),
    price: row.price.toString(),
    priceVariants: parsePriceVariants(row.priceVariants),
    measurementUnitId: row.measurementUnitId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}

function mapProductPublic(
  row: ProductWithRelations,
  images?: IProductImagePublic[],
): IProductPublicEntity {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    note: row.note,
    manualKkal: row.manualKkal?.toString() ?? null,
    nutritionalInfo: parseNutritionalInfo(row.nutritionalInfo),
    price: row.price.toString(),
    priceVariants: parsePriceVariants(row.priceVariants),
    measurementUnit: row.measurementUnit,
    categories: row.categories.map((item) => item.category),
    collections: row.collections.map((item) => item.productCollection),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    ...(images ? { images } : {}),
  };
}

async function loadProductImages(
  prisma: Pick<PrismaClient, 'image'>,
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
    urls: resolveProductImageUrls(row.file.fileUrl, row.file.metadata),
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
    try {
      const row = await this.client(scope).product.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description ?? null,
          note: input.note ?? null,
          manualKkal: input.manualKkal ?? null,
          nutritionalInfo: input.nutritionalInfo,
          price: input.price,
          priceVariants: input.priceVariants ?? undefined,
          measurementUnitId: input.measurementUnitId,
          categories: {
            create: input.categoryIds.map((categoryId) => ({ categoryId })),
          },
          collections: input.collectionIds?.length
            ? {
                create: input.collectionIds.map((productCollectionId) => ({
                  productCollectionId,
                })),
              }
            : undefined,
        },
      });
      return mapProductRow(row);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ProductSlugAlreadyExistsError(input.slug);
      }
      throw error;
    }
  }

  async update(
    id: string,
    input: IUpdateProductInput,
    scope?: TransactionScope,
  ): Promise<IProductEntity> {
    const client = this.client(scope);
    if (input.categoryIds !== undefined) {
      await client.productCategory.deleteMany({ where: { productId: id } });
      if (input.categoryIds.length > 0) {
        await client.productCategory.createMany({
          data: input.categoryIds.map((categoryId) => ({
            productId: id,
            categoryId,
          })),
        });
      }
    }

    if (input.collectionIds !== undefined) {
      await client.productCollectionProduct.deleteMany({
        where: { productId: id },
      });
      if (input.collectionIds.length > 0) {
        await client.productCollectionProduct.createMany({
          data: input.collectionIds.map((productCollectionId) => ({
            productId: id,
            productCollectionId,
          })),
        });
      }
    }

    const data: Prisma.ProductUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.slug !== undefined) data.slug = input.slug;
    if (input.description !== undefined) data.description = input.description;
    if (input.note !== undefined) data.note = input.note;
    if (input.manualKkal !== undefined) data.manualKkal = input.manualKkal;
    if (input.nutritionalInfo !== undefined) {
      data.nutritionalInfo = input.nutritionalInfo;
    }
    if (input.price !== undefined) data.price = input.price;
    if (input.priceVariants !== undefined) {
      data.priceVariants =
        input.priceVariants === null
          ? Prisma.DbNull
          : input.priceVariants;
    }
    if (input.measurementUnitId !== undefined) {
      data.measurementUnit = { connect: { id: input.measurementUnitId } };
    }

    try {
      const row = await client.product.update({
        where: { id },
        data,
      });
      return mapProductRow(row);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        input.slug
      ) {
        throw new ProductSlugAlreadyExistsError(input.slug);
      }
      throw error;
    }
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

  async findByIdOrSlug(idOrSlug: string): Promise<IProductEntity | null> {
    const row = await this.prisma.product.findFirst({
      where: {
        deletedAt: null,
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });
    return row ? mapProductRow(row) : null;
  }

  async findPublicByIdOrSlug(
    idOrSlug: string,
    options?: { includeImages?: boolean },
    scope?: TransactionScope,
  ): Promise<IProductPublicEntity | null> {
    const client = this.client(scope);
    const row = await client.product.findFirst({
      where: {
        deletedAt: null,
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: productInclude,
    });
    if (!row) {
      return null;
    }
    const images = options?.includeImages
      ? await loadProductImages(client, row.id)
      : undefined;
    return mapProductPublic(row as ProductWithRelations, images);
  }

  async findMany(
    params: FindManyParams,
  ): Promise<FindManyResult<IProductPublicEntity>> {
    const limit = params.slice?.limit ?? 20;
    const offset = params.slice?.offset ?? 0;
    const categoryId =
      typeof params.where?.categoryId === 'string'
        ? params.where.categoryId
        : undefined;
    const collectionId =
      typeof params.where?.collectionId === 'string'
        ? params.where.collectionId
        : undefined;

    const search =
      typeof params.where?.search === 'string' ? params.where.search : undefined;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(typeof params.where?.name === 'string'
        ? { name: { contains: params.where.name, mode: 'insensitive' } }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              {
                categories: {
                  some: {
                    category: {
                      name: { contains: search, mode: 'insensitive' },
                    },
                  },
                },
              },
            ],
          }
        : {}),
      ...(categoryId ? { categories: { some: { categoryId } } } : {}),
      ...(collectionId
        ? { collections: { some: { productCollectionId: collectionId } } }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: params.orderBy ?? [{ createdAt: 'desc' }],
        include: productInclude,
      }),
      this.prisma.product.count({ where }),
    ]);

    const items: IProductPublicEntity[] = [];
    for (const row of rows) {
      const images = params.includeImages
        ? await loadProductImages(this.prisma, row.id)
        : undefined;
      items.push(mapProductPublic(row as ProductWithRelations, images));
    }

    return { items, total };
  }
}
