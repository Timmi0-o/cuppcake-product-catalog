import type { FindManyResult } from '@shared/domain/query';
import { buildPaginatedListResponse } from '@shared/presentation/http';
import type {
  IProductImagePublic,
  IProductPublicEntity,
} from '@modules/products/domain/entities/product';
import type { ICategoryPublicEntity } from '@modules/products/domain/entities/category';
import type { IMeasurementUnitPublicEntity } from '@modules/products/domain/entities/measurement-unit';
import type { IProductCollectionPublicEntity } from '@modules/products/domain/entities/product-collection';

function mapImage(image: IProductImagePublic) {
  return {
    id: image.id,
    fileId: image.fileId,
    fileUrl: image.fileUrl,
    urls: image.urls,
    originalName: image.originalName,
    mimeType: image.mimeType,
    status: image.status,
    fileSize: image.fileSize,
    createdAt: image.createdAt.toISOString(),
  };
}

export function mapProductHttpResponse(product: IProductPublicEntity) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    note: product.note,
    manualKkal: product.manualKkal,
    nutritionalInfo: product.nutritionalInfo,
    price: product.price,
    priceVariants: product.priceVariants,
    measurementUnit: product.measurementUnit,
    categories: product.categories,
    collections: product.collections ?? [],
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    ...(product.images ? { images: product.images.map(mapImage) } : {}),
  };
}

export function mapProductsListHttpResponse(
  result: FindManyResult<IProductPublicEntity>,
  pagination?: { page?: number; limit?: number },
) {
  return buildPaginatedListResponse({
    items: result.items.map(mapProductHttpResponse),
    totalCount: result.total,
    page: pagination?.page,
    limit: pagination?.limit,
  });
}

export function mapProductImagesHttpResponse(images: IProductImagePublic[]) {
  return images.map(mapImage);
}

export function mapCategoriesHttpResponse(items: ICategoryPublicEntity[]) {
  return items;
}

export function mapProductCollectionsHttpResponse(
  items: IProductCollectionPublicEntity[],
) {
  return items;
}

export function mapMeasurementUnitsHttpResponse(
  items: IMeasurementUnitPublicEntity[],
) {
  return items;
}
