import type {
  ICatalogPriceBucket,
  ICatalogStats,
  ICatalogStatsRepository,
} from "@modules/products/domain/repositories/catalog-stats/i-catalog-stats.repository";
import type { Prisma, PrismaClient } from "@prisma/client";

const DRINKS_CATEGORY_SLUG = "napitki";
const PRICE_BUCKET_COUNT = 6;

const notDeleted = { deletedAt: null } as const;

function toNumber(
  value: Prisma.Decimal | number | null | undefined,
): number | null {
  if (value == null) {
    return null;
  }
  return Number(value);
}

function buildEqualWidthBuckets(
  priceMin: number,
  priceMax: number,
): Array<{ from: number; to: number; isLast: boolean }> {
  if (priceMin === priceMax) {
    return [{ from: priceMin, to: priceMax, isLast: true }];
  }

  const width = (priceMax - priceMin) / PRICE_BUCKET_COUNT;
  return Array.from({ length: PRICE_BUCKET_COUNT }, (_, index) => {
    const isLast = index === PRICE_BUCKET_COUNT - 1;
    const from = priceMin + width * index;
    const to = isLast ? priceMax : priceMin + width * (index + 1);
    return { from, to, isLast };
  });
}

export class PrismaCatalogStatsRepository implements ICatalogStatsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getStats(): Promise<ICatalogStats> {
    const [
      productsTotal,
      categoriesTotal,
      collectionsTotal,
      drinksCount,
      dessertsCount,
      priceAggregate,
    ] = await Promise.all([
      this.prisma.product.count({ where: notDeleted }),
      this.prisma.category.count({ where: notDeleted }),
      this.prisma.productCollection.count({ where: notDeleted }),
      this.prisma.product.count({
        where: {
          ...notDeleted,
          categories: {
            some: {
              category: {
                slug: DRINKS_CATEGORY_SLUG,
                deletedAt: null,
              },
            },
          },
        },
      }),
      this.prisma.product.count({
        where: {
          ...notDeleted,
          categories: {
            none: {
              category: {
                slug: DRINKS_CATEGORY_SLUG,
              },
            },
          },
        },
      }),
      this.prisma.product.aggregate({
        where: notDeleted,
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    const priceMin = toNumber(priceAggregate._min.price);
    const priceMax = toNumber(priceAggregate._max.price);

    let priceBuckets: ICatalogPriceBucket[] = [];

    if (priceMin != null && priceMax != null && productsTotal > 0) {
      const ranges = buildEqualWidthBuckets(priceMin, priceMax);
      priceBuckets = await Promise.all(
        ranges.map(async (range) => {
          const count = await this.prisma.product.count({
            where: {
              ...notDeleted,
              price: range.isLast
                ? { gte: range.from, lte: range.to }
                : { gte: range.from, lt: range.to },
            },
          });

          return {
            from: Number(range.from.toFixed(2)),
            to: Number(range.to.toFixed(2)),
            count,
          };
        }),
      );
    }

    return {
      productsTotal,
      categoriesTotal,
      collectionsTotal,
      drinksCount,
      dessertsCount,
      priceMin,
      priceMax,
      priceBuckets,
    };
  }
}
