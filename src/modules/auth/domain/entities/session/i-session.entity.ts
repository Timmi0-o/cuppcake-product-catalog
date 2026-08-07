export type ISessionEntity = {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ICreateSessionInput = {
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};
