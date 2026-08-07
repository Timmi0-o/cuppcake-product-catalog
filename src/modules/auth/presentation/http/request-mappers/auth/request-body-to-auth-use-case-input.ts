import type { AuthenticatedActor } from '@shared/presentation/http';
import type { IRegisterApplicationInput } from '@modules/auth/application/dtos/i-register-input.dto';
import type { RegisterPayload } from '../../validation/schemas/register-payload.schema';

export function requestBodyToRegisterUseCaseInput(
  body: RegisterPayload,
  meta: { ipAddress?: string | null; userAgent?: string | null },
): IRegisterApplicationInput {
  return {
    email: body.email,
    password: body.password,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  };
}

export function requestBodyToLoginUseCaseInput(
  body: { email: string; password: string },
  meta: { ipAddress?: string | null; userAgent?: string | null },
) {
  return {
    email: body.email,
    password: body.password,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  };
}

export function requestBodyToRefreshUseCaseInput(
  body: { refreshToken: string },
  meta: { ipAddress?: string | null; userAgent?: string | null },
) {
  return {
    refreshToken: body.refreshToken,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  };
}

export function requestBodyToLogoutUseCaseInput(
  actor: AuthenticatedActor,
  body: { refreshToken?: string },
) {
  return {
    userId: actor.userId,
    refreshToken: body.refreshToken,
  };
}
