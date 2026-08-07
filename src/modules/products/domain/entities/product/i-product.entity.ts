export type INutritionalInfo = {
  protein: number;
  fats: number;
  carbohydrates: number;
};

export type IProductEntity = {
  id: string;
  name: string;
  description: string | null;
  manualKkal: string;
  nutritionalInfo: INutritionalInfo;
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
};

export type IUpdateProductInput = {
  name?: string;
  description?: string | null;
  manualKkal?: string;
  nutritionalInfo?: INutritionalInfo;
};
