export enum ImageEntityType {
  PRODUCT = 'PRODUCT',
}

export type IImageEntity = {
  id: string;
  entityType: ImageEntityType;
  entityId: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ICreateImageInput = {
  entityType: ImageEntityType;
  entityId: string;
  fileId: string;
};
