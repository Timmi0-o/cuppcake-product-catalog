import { z } from "zod";

export const ProductCollectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export type IProductCollection = z.infer<typeof ProductCollectionSchema>;

export const ProductCollectionsGetManyFiltersSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(200).optional(),
});

export type IProductCollectionsGetManyFilters = z.infer<
  typeof ProductCollectionsGetManyFiltersSchema
>;
