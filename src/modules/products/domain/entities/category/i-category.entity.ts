export type ICategoryEntity = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  parentCategoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type ICategoryPublicEntity = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  parentCategoryId: string | null;
};

export type ICreateCategoryInput = {
  name: string;
  slug: string;
  sortOrder?: number;
  parentCategoryId?: string | null;
};
