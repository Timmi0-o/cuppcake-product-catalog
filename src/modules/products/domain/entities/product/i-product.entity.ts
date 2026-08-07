export type INutritionalInfo = {
  protein: number;
  fats: number;
  carbohydrates: number;
};

export type IProductPriceVariant = {
  volumeMl: number;
  price: string;
};

export type IProductCategoryPublic = {
  id: string;
  name: string;
  slug: string;
  parentCategoryId: string | null;
};

export type IProductMeasurementUnitPublic = {
  id: string;
  name: string;
  symbol: string;
};

export type IProductCollectionPublic = {
  id: string;
  name: string;
};

export type IProductEntity = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  note: string | null;
  manualKkal: string;
  nutritionalInfo: INutritionalInfo;
  price: string;
  priceVariants: IProductPriceVariant[] | null;
  measurementUnitId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IProductPublicEntity = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  note: string | null;
  manualKkal: string;
  nutritionalInfo: INutritionalInfo;
  price: string;
  priceVariants: IProductPriceVariant[] | null;
  measurementUnit: IProductMeasurementUnitPublic;
  categories: IProductCategoryPublic[];
  collections?: IProductCollectionPublic[];
  createdAt: Date;
  updatedAt: Date;
  images?: IProductImagePublic[];
};

export type IProductImagePublic = {
  id: string;
  fileId: string;
  /** ORIGINAL variant URL (source format). */
  fileUrl: string;
  /** All variant URLs: low_/medium_/high_ (webp) + original_ (source format). */
  urls: string[];
  originalName: string;
  mimeType: string;
  status: string;
  fileSize: string;
  createdAt: Date;
};

export type ICreateProductInput = {
  name: string;
  slug: string;
  description?: string | null;
  note?: string | null;
  manualKkal: string;
  nutritionalInfo: INutritionalInfo;
  price: string;
  priceVariants?: IProductPriceVariant[] | null;
  measurementUnitId: string;
  categoryIds: string[];
  collectionIds?: string[];
};

export type IUpdateProductInput = {
  name?: string;
  slug?: string;
  description?: string | null;
  note?: string | null;
  manualKkal?: string;
  nutritionalInfo?: INutritionalInfo;
  price?: string;
  priceVariants?: IProductPriceVariant[] | null;
  measurementUnitId?: string;
  categoryIds?: string[];
  collectionIds?: string[];
};
