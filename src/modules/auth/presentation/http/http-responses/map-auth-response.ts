import type { IAuthResponse } from '@modules/auth/domain/auth.types';
import type { IUserPublicEntity } from '@modules/users/domain/entities/user';

export function mapAuthHttpResponse(output: IAuthResponse) {
  return {
    user: {
      id: output.user.id,
      email: output.user.email,
      createdAt: output.user.createdAt.toISOString(),
      updatedAt: output.user.updatedAt.toISOString(),
    },
    tokens: output.tokens,
  };
}

export function mapGetMeHttpResponse(output: IUserPublicEntity) {
  return {
    id: output.id,
    email: output.email,
    createdAt: output.createdAt.toISOString(),
    updatedAt: output.updatedAt.toISOString(),
  };
}
