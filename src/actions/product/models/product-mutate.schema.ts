import { z } from 'zod';

const nutritionalInfoSchema = z.object({
  protein: z.coerce.number(),
  fats: z.coerce.number(),
  carbohydrates: z.coerce.number(),
});

const priceVariantSchema = z.object({
  volumeMl: z.coerce.number().positive(),
  price: z.union([z.string(), z.number()]).transform(String),
});

const slugSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const ProductCreateInputSchema = z.object({
  name: z.string().min(1).max(255),
  slug: slugSchema.optional(),
  description: z.string().max(5000).nullable().optional(),
  note: z.string().max(2000).nullable().optional(),
  manualKkal: z.union([z.string(), z.number()]).transform(String),
  nutritionalInfo: nutritionalInfoSchema,
  price: z.union([z.string(), z.number()]).transform(String),
  priceVariants: z.array(priceVariantSchema).nullable().optional(),
  measurementUnitId: z.string().uuid(),
  categoryIds: z.array(z.string().uuid()).default([]),
  collectionIds: z.array(z.string().uuid()).optional(),
});

export const ProductUpdateInputSchema = ProductCreateInputSchema.partial().extend(
  {
    name: z.string().min(1).max(255).optional(),
  },
);

export const ProductDeleteImagesInputSchema = z.object({
  fileIds: z.array(z.string().uuid()).min(1),
});

export type IProductCreateInput = z.infer<typeof ProductCreateInputSchema>;
export type IProductUpdateInput = z.infer<typeof ProductUpdateInputSchema>;
export type IProductDeleteImagesInput = z.infer<
  typeof ProductDeleteImagesInputSchema
>;
