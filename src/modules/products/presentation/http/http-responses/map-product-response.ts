import type { FindManyResult } from '@shared/domain/query';
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
) {
  return {
    items: result.items.map(mapProductHttpResponse),
    total: result.total,
  };
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
