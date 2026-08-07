export type INutritionalInfo = {
  protein: number;
  fats: number;
  carbohydrates: number;
};

export type IProductCategoryPublic = {
  id: string;
  name: string;
  slug: string;
};

export type IProductMeasurementUnitPublic = {
  id: string;
  name: string;
  symbol: string;
};

export type IProductEntity = {
  id: string;
  name: string;
  description: string | null;
  manualKkal: string;
  nutritionalInfo: INutritionalInfo;
  price: string;
  measurementUnitId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IProductPublicEntity = {
  id: string;
  name: string;
  description: string | null;
  manualKkal: string;
  nutritionalInfo: INutritionalInfo;
  price: string;
  measurementUnit: IProductMeasurementUnitPublic;
  categories: IProductCategoryPublic[];
  createdAt: Date;
  updatedAt: Date;
  images?: IProductImagePublic[];
};

export type IProductImagePublic = {
  id: string;
  fileId: string;
  fileUrl: string;
  originalName: string;
  mimeType: string;
  status: string;
  fileSize: string;
  createdAt: Date;
};

export type ICreateProductInput = {
  name: string;
  description?: string | null;
  manualKkal: string;
  nutritionalInfo: INutritionalInfo;
  price: string;
  measurementUnitId: string;
  categoryIds: string[];
};

export type IUpdateProductInput = {
  name?: string;
  description?: string | null;
  manualKkal?: string;
  nutritionalInfo?: INutritionalInfo;
  price?: string;
  measurementUnitId?: string;
  categoryIds?: string[];
};
