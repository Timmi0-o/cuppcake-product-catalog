export type IUserEntity = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IUserPublicEntity = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
