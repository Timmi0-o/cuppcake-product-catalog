export type IProductCollectionEntity = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IProductCollectionPublicEntity = {
  id: string;
  name: string;
};

export type ICreateProductCollectionInput = {
  name: string;
};
