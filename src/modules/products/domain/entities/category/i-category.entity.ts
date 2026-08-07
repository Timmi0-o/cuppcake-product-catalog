export type ICategoryEntity = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type ICategoryPublicEntity = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
};

export type ICreateCategoryInput = {
  name: string;
  slug: string;
  sortOrder?: number;
};
