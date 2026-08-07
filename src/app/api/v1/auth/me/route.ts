import { createAuthContainer } from '@/lib/di/auth.container';
import { mapGetMeHttpResponse } from '@modules/auth/presentation/http/http-responses/map-auth-response';
import {
  handleRouteError,
  jsonResult,
  requireBearerUser,
} from '@shared/presentation/http';

export async function GET(request: Request) {
  try {
    const { tokenService, getMe } = createAuthContainer();
    const actor = await requireBearerUser(request, (token) =>
      tokenService.verifyAccessToken(token),
    );
    const output = await getMe.execute({ userId: actor.userId });
    return jsonResult(mapGetMeHttpResponse(output));
  } catch (error) {
    return handleRouteError(error);
  }
}
