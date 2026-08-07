import { z } from "zod";

export const CatalogPriceBucketSchema = z.object({
  from: z.number(),
  to: z.number(),
  count: z.number().int(),
});

export const CatalogStatsSchema = z.object({
  productsTotal: z.number().int(),
  categoriesTotal: z.number().int(),
  collectionsTotal: z.number().int(),
  drinksCount: z.number().int(),
  dessertsCount: z.number().int(),
  priceMin: z.number().nullable(),
  priceMax: z.number().nullable(),
  priceBuckets: z.array(CatalogPriceBucketSchema),
});

export type ICatalogStats = z.infer<typeof CatalogStatsSchema>;
export type ICatalogPriceBucket = z.infer<typeof CatalogPriceBucketSchema>;
