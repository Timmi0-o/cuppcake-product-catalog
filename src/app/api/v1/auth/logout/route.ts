import { createAuthContainer } from '@/lib/di/auth.container';
import { requestBodyToLogoutUseCaseInput } from '@modules/auth/presentation/http/request-mappers/auth/request-body-to-auth-use-case-input';
import { logoutPayloadSchema } from '@modules/auth/presentation/http/validation/schemas/logout-payload.schema';
import {
  handleRouteError,
  jsonResult,
  requireBearerUser,
} from '@shared/presentation/http';

export async function POST(request: Request) {
  try {
    const { tokenService, logout } = createAuthContainer();
    const actor = await requireBearerUser(request, (token) =>
      tokenService.verifyAccessToken(token),
    );
    const json = await request.json().catch(() => ({}));
    const body = logoutPayloadSchema.parse(json);
    const output = await logout.execute(
      requestBodyToLogoutUseCaseInput(actor, body),
    );
    return jsonResult(output);
  } catch (error) {
    return handleRouteError(error);
  }
}
