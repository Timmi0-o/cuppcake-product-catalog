import type { IGetCatalogStatsApplicationOutput } from "@modules/products/application/dtos/i-get-catalog-stats-output.dto";

export function mapCatalogStatsHttpResponse(
  stats: IGetCatalogStatsApplicationOutput,
) {
  return {
    productsTotal: stats.productsTotal,
    categoriesTotal: stats.categoriesTotal,
    collectionsTotal: stats.collectionsTotal,
    drinksCount: stats.drinksCount,
    dessertsCount: stats.dessertsCount,
    priceMin: stats.priceMin,
    priceMax: stats.priceMax,
    priceBuckets: stats.priceBuckets.map((bucket) => ({
      from: bucket.from,
      to: bucket.to,
      count: bucket.count,
    })),
  };
}
