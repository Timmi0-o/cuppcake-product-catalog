export type IRefreshTokenEntity = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ICreateRefreshTokenInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};
