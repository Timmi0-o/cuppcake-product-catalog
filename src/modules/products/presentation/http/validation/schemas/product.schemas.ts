import { z } from 'zod';

export const nutritionalInfoSchema = z.object({
  protein: z.number(),
  fats: z.number(),
  carbohydrates: z.number(),
});

export const createProductPayloadSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(5000).nullable().optional(),
  manualKkal: z.union([z.string(), z.number()]).transform(String),
  nutritionalInfo: nutritionalInfoSchema,
});

export const updateProductPayloadSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  manualKkal: z.union([z.string(), z.number()]).transform(String).optional(),
  nutritionalInfo: nutritionalInfoSchema.optional(),
});

export const productIdParamsSchema = z.object({
  id: z.uuid(),
});

export const findProductsQuerySchema = z.object({
  name: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  includeImages: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
});

export const deleteProductImagesPayloadSchema = z.object({
  fileIds: z.array(z.uuid()).min(1),
});

export type CreateProductPayload = z.infer<typeof createProductPayloadSchema>;
export type UpdateProductPayload = z.infer<typeof updateProductPayloadSchema>;
