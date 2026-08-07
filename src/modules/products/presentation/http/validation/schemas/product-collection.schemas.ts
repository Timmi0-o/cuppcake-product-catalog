import { z } from 'zod';

export const findProductCollectionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
});

export const productCollectionIdParamsSchema = z.object({
  id: z.uuid(),
});

export type FindProductCollectionsQuery = z.infer<
  typeof findProductCollectionsQuerySchema
>;
