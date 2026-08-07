import type { INutritionalInfo } from '../../domain/entities/product';

export type ICreateProductApplicationInput = {
  name: string;
  description?: string | null;
  manualKkal: string;
  nutritionalInfo: INutritionalInfo;
};

export type IUpdateProductApplicationInput = {
  productId: string;
  name?: string;
  description?: string | null;
  manualKkal?: string;
  nutritionalInfo?: INutritionalInfo;
};

export type IGetProductByIdApplicationInput = {
  productId: string;
  includeImages?: boolean;
};

export type IFindProductsApplicationInput = {
  name?: string;
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
