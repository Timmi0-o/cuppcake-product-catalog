import type { IUserPublicEntity } from '@modules/users/domain/entities/user';

export type IAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type IAuthResponse = {
  user: IUserPublicEntity;
  tokens: IAuthTokens;
};
