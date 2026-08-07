import { createAuthContainer } from '@/lib/di/auth.container';
import { requestBodyToRefreshUseCaseInput } from '@modules/auth/presentation/http/request-mappers/auth/request-body-to-auth-use-case-input';
import { mapAuthHttpResponse } from '@modules/auth/presentation/http/http-responses/map-auth-response';
import { refreshPayloadSchema } from '@modules/auth/presentation/http/validation/schemas/refresh-payload.schema';
import {
  getRequestMeta,
  handleRouteError,
  jsonResult,
} from '@shared/presentation/http';

export async function POST(request: Request) {
  try {
    const body = refreshPayloadSchema.parse(await request.json());
    const meta = getRequestMeta(request);
    const { refresh } = createAuthContainer();
    const output = await refresh.execute(
      requestBodyToRefreshUseCaseInput(body, meta),
    );
    return jsonResult(mapAuthHttpResponse(output));
  } catch (error) {
    return handleRouteError(error);
  }
}
