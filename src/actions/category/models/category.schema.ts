import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  sortOrder: z.number(),
  parentCategoryId: z.string().nullable(),
});

export type ICategory = z.infer<typeof CategorySchema>;
