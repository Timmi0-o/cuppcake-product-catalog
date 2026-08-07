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
    description: body.description,
    manualKkal: body.manualKkal,
    nutritionalInfo: body.nutritionalInfo,
    price: body.price,
    measurementUnitId: body.measurementUnitId,
    categoryIds: body.categoryIds,
  };
}

export function requestBodyToUpdateProductUseCaseInput(
  productId: string,
  body: UpdateProductPayload,
) {
  return {
    productId,
    name: body.name,
    description: body.description,
    manualKkal: body.manualKkal,
    nutritionalInfo: body.nutritionalInfo,
    price: body.price,
    measurementUnitId: body.measurementUnitId,
    categoryIds: body.categoryIds,
  };
}

export function requestParamsToGetProductByIdUseCaseInput(
  productId: string,
  includeImages?: boolean,
) {
  return { productId, includeImages };
}

export function requestQueryParamsToFindProductsUseCaseInput(query: {
  name?: string;
  categoryId?: string;
  limit?: number;
  offset?: number;
  includeImages?: boolean;
}) {
  return {
    name: query.name,
    categoryId: query.categoryId,
    limit: query.limit,
    offset: query.offset,
    includeImages: query.includeImages,
  };
}

export function requestParamsToDeleteProductUseCaseInput(productId: string) {
  return { productId };
}

export function requestMultipartToUploadProductImagesUseCaseInput(input: {
  productId: string;
  actor: AuthenticatedActor;
  files: Array<{ originalName: string; buffer: Buffer }>;
}) {
  return {
    productId: input.productId,
    actorUserId: input.actor.userId,
    files: input.files,
  };
}

export function requestBodyToDeleteProductImagesUseCaseInput(
  productId: string,
  body: { fileIds: string[] },
) {
  return {
    productId,
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
  };
}
