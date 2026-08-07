import type { FindManyResult } from '@shared/domain/query';
import type {
  IProductImagePublic,
  IProductPublicEntity,
} from '@modules/products/domain/entities/product';

function mapImage(image: IProductImagePublic) {
  return {
    id: image.id,
    fileId: image.fileId,
    fileUrl: image.fileUrl,
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
    description: product.description,
    manualKkal: product.manualKkal,
    nutritionalInfo: product.nutritionalInfo,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    ...(product.images
      ? { images: product.images.map(mapImage) }
      : {}),
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
