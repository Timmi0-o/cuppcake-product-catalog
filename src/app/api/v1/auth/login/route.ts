import { createAuthContainer } from '@/lib/di/auth.container';
import { requestBodyToLoginUseCaseInput } from '@modules/auth/presentation/http/request-mappers/auth/request-body-to-auth-use-case-input';
import { mapAuthHttpResponse } from '@modules/auth/presentation/http/http-responses/map-auth-response';
import { loginPayloadSchema } from '@modules/auth/presentation/http/validation/schemas/login-payload.schema';
import {
  getRequestMeta,
  handleRouteError,
  jsonResult,
} from '@shared/presentation/http';

export async function POST(request: Request) {
  try {
    const body = loginPayloadSchema.parse(await request.json());
    const meta = getRequestMeta(request);
    const { login } = createAuthContainer();
    const output = await login.execute(
      requestBodyToLoginUseCaseInput(body, meta),
    );
    return jsonResult(mapAuthHttpResponse(output));
  } catch (error) {
    return handleRouteError(error);
  }
}
