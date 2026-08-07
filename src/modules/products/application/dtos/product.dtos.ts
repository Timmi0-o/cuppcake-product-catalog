import type { INutritionalInfo } from '../../domain/entities/product';

export type ICreateProductApplicationInput = {
  name: string;
  description?: string | null;
  manualKkal: string;
  nutritionalInfo: INutritionalInfo;
  price: string;
  measurementUnitId: string;
  categoryIds: string[];
};

export type IUpdateProductApplicationInput = {
  productId: string;
  name?: string;
  description?: string | null;
  manualKkal?: string;
  nutritionalInfo?: INutritionalInfo;
  price?: string;
  measurementUnitId?: string;
  categoryIds?: string[];
};

export type IGetProductByIdApplicationInput = {
  productId: string;
  includeImages?: boolean;
};

export type IFindProductsApplicationInput = {
  name?: string;
  categoryId?: string;
  limit?: number;
  offset?: number;
  includeImages?: boolean;
};

export type IDeleteProductApplicationInput = {
  productId: string;
};

export type IUploadProductImagesApplicationInput = {
  productId: string;
  actorUserId: string;
  files: Array<{
    originalName: string;
    buffer: Buffer;
  }>;
};

export type IDeleteProductImagesApplicationInput = {
  productId: string;
  fileIds: string[];
};

export type ICreateCategoryApplicationInput = {
  name: string;
  slug: string;
  sortOrder?: number;
};
