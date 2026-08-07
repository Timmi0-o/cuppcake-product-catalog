import { z } from "zod";

export const ProductsGetOneFiltersSchema = z.object({
  includeImages: z.boolean().optional(),
});

export const ProductsGetManyFiltersSchema = z.object({
  name: z.string().optional(),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  categorySlug: z.string().optional(),
  collectionId: z.string().uuid().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(200).optional(),
  includeImages: z.boolean().optional(),
});

export type IProductsGetOneFilters = z.infer<
  typeof ProductsGetOneFiltersSchema
>;
export type IProductsGetManyFilters = z.infer<
  typeof ProductsGetManyFiltersSchema
>;
