import type { AuthenticatedActor } from '@shared/presentation/http';
import type {
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
  limit?: number;
  offset?: number;
  includeImages?: boolean;
}) {
  return {
    name: query.name,
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
