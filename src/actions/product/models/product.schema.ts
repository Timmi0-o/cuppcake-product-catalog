import { z } from "zod";

export const ProductImageSchema = z.object({
  id: z.string(),
  fileId: z.string(),
  fileUrl: z.string(),
  urls: z.array(z.string()).default([]),
  originalName: z.string(),
  mimeType: z.string(),
  status: z.string(),
  fileSize: z.string(),
  createdAt: z.string(),
});

export const ProductCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  parentCategoryId: z.string().nullable(),
});

export const ProductCollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const ProductMeasurementUnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
});

export const ProductNutritionalInfoSchema = z.object({
  protein: z.number(),
  fats: z.number(),
  carbohydrates: z.number(),
});

export const ProductPriceVariantSchema = z.object({
  volumeMl: z.number(),
  price: z.string(),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  note: z.string().nullable(),
  manualKkal: z.string().nullable(),
  nutritionalInfo: ProductNutritionalInfoSchema,
  price: z.string(),
  priceVariants: z.array(ProductPriceVariantSchema).nullable(),
  measurementUnit: ProductMeasurementUnitSchema,
  categories: z.array(ProductCategorySchema),
  collections: z.array(ProductCollectionSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  images: z.array(ProductImageSchema).optional(),
});

export type IProduct = z.infer<typeof ProductSchema>;
export type IProductImage = z.infer<typeof ProductImageSchema>;
