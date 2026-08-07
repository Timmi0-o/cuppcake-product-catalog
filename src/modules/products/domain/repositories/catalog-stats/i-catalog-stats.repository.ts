export type ICatalogPriceBucket = {
  from: number;
  to: number;
  count: number;
};

export type ICatalogStats = {
  productsTotal: number;
  categoriesTotal: number;
  collectionsTotal: number;
  drinksCount: number;
  dessertsCount: number;
  priceMin: number | null;
  priceMax: number | null;
  priceBuckets: ICatalogPriceBucket[];
};

export interface ICatalogStatsRepository {
  getStats(): Promise<ICatalogStats>;
}

export const CATALOG_STATS_REPOSITORY_TOKEN = Symbol("ICatalogStatsRepository");
