import { type Category, Prisma, type PrismaClient } from '@prisma/client';
import type {
  ICategoryEntity,
  ICategoryPublicEntity,
  ICreateCategoryInput,
} from '@modules/products/domain/entities/category';
import { CategorySlugAlreadyExistsError } from '@modules/products/domain/entities/category';
import type { ICategoryRepository } from '@modules/products/domain/repositories/category/i-category.repository';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';

function mapCategoryRow(row: Category): ICategoryEntity {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sortOrder: row.sortOrder,
    parentCategoryId: row.parentCategoryId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}

export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private client(scope?: TransactionScope) {
    return scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
  }

  async findManyPublic(): Promise<ICategoryPublicEntity[]> {
    const rows = await this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      sortOrder: row.sortOrder,
      parentCategoryId: row.parentCategoryId,
    }));
  }

  async findById(id: string): Promise<ICategoryEntity | null> {
    const row = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? mapCategoryRow(row) : null;
  }

  async findBySlug(slug: string): Promise<ICategoryEntity | null> {
    const row = await this.prisma.category.findFirst({
      where: { slug, deletedAt: null },
    });
    return row ? mapCategoryRow(row) : null;
  }

  async findByIds(ids: string[]): Promise<ICategoryEntity[]> {
    if (ids.length === 0) return [];
    const rows = await this.prisma.category.findMany({
      where: { id: { in: ids }, deletedAt: null },
    });
    return rows.map(mapCategoryRow);
  }

  async create(
    input: ICreateCategoryInput,
    scope?: TransactionScope,
  ): Promise<ICategoryEntity> {
    try {
      const row = await this.client(scope).category.create({
        data: {
          name: input.name,
          slug: input.slug,
          sortOrder: input.sortOrder ?? 0,
          parentCategoryId: input.parentCategoryId ?? null,
        },
      });
      return mapCategoryRow(row);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new CategorySlugAlreadyExistsError(input.slug);
      }
      throw error;
    }
  }
}
