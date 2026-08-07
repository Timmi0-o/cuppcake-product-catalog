import type {
  INutritionalInfo,
  IProductPriceVariant,
} from '../../domain/entities/product';

export type ICreateProductApplicationInput = {
  name: string;
  slug?: string;
  description?: string | null;
  note?: string | null;
  manualKkal?: string | null;
  nutritionalInfo: INutritionalInfo;
  price: string;
  priceVariants?: IProductPriceVariant[] | null;
  measurementUnitId: string;
  categoryIds: string[];
  collectionIds?: string[];
};

export type IUpdateProductApplicationInput = {
  productIdOrSlug: string;
  name?: string;
  slug?: string;
  description?: string | null;
  note?: string | null;
  manualKkal?: string | null;
  nutritionalInfo?: INutritionalInfo;
  price?: string;
  priceVariants?: IProductPriceVariant[] | null;
  measurementUnitId?: string;
  categoryIds?: string[];
  collectionIds?: string[];
};

export type IGetProductByIdApplicationInput = {
  productIdOrSlug: string;
  includeImages?: boolean;
};

export type IFindProductsApplicationInput = {
  name?: string;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  collectionId?: string;
  page?: number;
  limit?: number;
  includeImages?: boolean;
};

export type IDeleteProductApplicationInput = {
  productIdOrSlug: string;
};

export type IUploadProductImagesApplicationInput = {
  productIdOrSlug: string;
  actorUserId: string;
  files: Array<{
    originalName: string;
    buffer: Buffer;
  }>;
};

export type IDeleteProductImagesApplicationInput = {
  productIdOrSlug: string;
  fileIds: string[];
};

export type ICreateCategoryApplicationInput = {
  name: string;
  slug: string;
  sortOrder?: number;
  parentCategoryId?: string | null;
};

export type ICreateProductCollectionApplicationInput = {
  name: string;
};

export type IFindProductCollectionsApplicationInput = {
  page?: number;
  limit?: number;
};

export type IGetProductCollectionByIdApplicationInput = {
  collectionId: string;
};
