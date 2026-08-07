import type { AuthenticatedActor } from '@shared/presentation/http';
import type {
  CreateCategoryPayload,
  CreateProductPayload,
  UpdateProductPayload,
} from '../../validation/schemas/product.schemas';

export function requestBodyToCreateProductUseCaseInput(
  body: CreateProductPayload,
) {
  return {
    name: body.name,
    slug: body.slug,
    description: body.description,
    note: body.note,
    manualKkal: body.manualKkal,
    nutritionalInfo: body.nutritionalInfo,
    price: body.price,
    priceVariants: body.priceVariants,
    measurementUnitId: body.measurementUnitId,
    categoryIds: body.categoryIds,
    collectionIds: body.collectionIds,
  };
}

export function requestBodyToUpdateProductUseCaseInput(
  productIdOrSlug: string,
  body: UpdateProductPayload,
) {
  return {
    productIdOrSlug,
    name: body.name,
    slug: body.slug,
    description: body.description,
    note: body.note,
    manualKkal: body.manualKkal,
    nutritionalInfo: body.nutritionalInfo,
    price: body.price,
    priceVariants: body.priceVariants,
    measurementUnitId: body.measurementUnitId,
    categoryIds: body.categoryIds,
    collectionIds: body.collectionIds,
  };
}

export function requestParamsToGetProductByIdUseCaseInput(
  productIdOrSlug: string,
  includeImages?: boolean,
) {
  return { productIdOrSlug, includeImages };
}

export function requestQueryParamsToFindProductsUseCaseInput(query: {
  name?: string;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  collectionId?: string;
  page?: number;
  limit?: number;
  includeImages?: boolean;
}) {
  const search = query.search?.trim() || undefined;

  return {
    name: query.name,
    search,
    categoryId: query.categoryId,
    categorySlug: query.categorySlug,
    collectionId: query.collectionId,
    page: query.page,
    limit: query.limit,
    includeImages: query.includeImages,
  };
}

export function requestParamsToDeleteProductUseCaseInput(
  productIdOrSlug: string,
) {
  return { productIdOrSlug };
}

export function requestMultipartToUploadProductImagesUseCaseInput(input: {
  productIdOrSlug: string;
  actor: AuthenticatedActor;
  files: Array<{ originalName: string; buffer: Buffer }>;
}) {
  return {
    productIdOrSlug: input.productIdOrSlug,
    actorUserId: input.actor.userId,
    files: input.files,
  };
}

export function requestBodyToDeleteProductImagesUseCaseInput(
  productIdOrSlug: string,
  body: { fileIds: string[] },
) {
  return {
    productIdOrSlug,
    fileIds: body.fileIds,
  };
}

export function requestBodyToCreateCategoryUseCaseInput(
  body: CreateCategoryPayload,
) {
  return {
    name: body.name,
    slug: body.slug,
    sortOrder: body.sortOrder,
    parentCategoryId: body.parentCategoryId,
  };
}
