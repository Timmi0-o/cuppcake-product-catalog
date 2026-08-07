import { z } from 'zod';

export const nutritionalInfoSchema = z.object({
  protein: z.number(),
  fats: z.number(),
  carbohydrates: z.number(),
});

export const priceVariantSchema = z.object({
  volumeMl: z.number().positive(),
  price: z.union([z.string(), z.number()]).transform(String),
});

export const slugSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const productIdOrSlugSchema = z.union([z.uuid(), slugSchema]);

export const createProductPayloadSchema = z.object({
  name: z.string().min(1).max(255),
  slug: slugSchema.optional(),
  description: z.string().max(5000).nullable().optional(),
  note: z.string().max(2000).nullable().optional(),
  manualKkal: z.union([z.string(), z.number()]).transform(String),
  nutritionalInfo: nutritionalInfoSchema,
  price: z.union([z.string(), z.number()]).transform(String),
  priceVariants: z.array(priceVariantSchema).nullable().optional(),
  measurementUnitId: z.uuid(),
  categoryIds: z.array(z.uuid()).default([]),
  collectionIds: z.array(z.uuid()).optional(),
});

export const updateProductPayloadSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: slugSchema.optional(),
  description: z.string().max(5000).nullable().optional(),
  note: z.string().max(2000).nullable().optional(),
  manualKkal: z.union([z.string(), z.number()]).transform(String).optional(),
  nutritionalInfo: nutritionalInfoSchema.optional(),
  price: z.union([z.string(), z.number()]).transform(String).optional(),
  priceVariants: z.array(priceVariantSchema).nullable().optional(),
  measurementUnitId: z.uuid().optional(),
  categoryIds: z.array(z.uuid()).optional(),
  collectionIds: z.array(z.uuid()).optional(),
});

export const productIdParamsSchema = z.object({
  id: productIdOrSlugSchema,
});

export const findProductsQuerySchema = z
  .object({
    name: z.string().optional(),
    search: z.string().optional(),
    categoryId: z.uuid().optional(),
    categorySlug: slugSchema.optional(),
    collectionId: z.uuid().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(200).optional(),
    includeImages: z
      .enum(['true', 'false'])
      .optional()
      .transform((value) =>
        value === undefined ? undefined : value === 'true',
      ),
  })
  .refine(
    (query) => !(query.categoryId && query.categorySlug),
    {
      message: 'Pass either categoryId or categorySlug, not both',
      path: ['categorySlug'],
    },
  );

export const deleteProductImagesPayloadSchema = z.object({
  fileIds: z.array(z.uuid()).min(1),
});

export const createCategoryPayloadSchema = z.object({
  name: z.string().min(1).max(255),
  slug: slugSchema,
  sortOrder: z.number().int().optional(),
  parentCategoryId: z.uuid().nullable().optional(),
});

export type CreateProductPayload = z.infer<typeof createProductPayloadSchema>;
export type UpdateProductPayload = z.infer<typeof updateProductPayloadSchema>;
export type CreateCategoryPayload = z.infer<typeof createCategoryPayloadSchema>;
