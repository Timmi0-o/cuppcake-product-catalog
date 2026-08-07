import { createAuthContainer } from '@/lib/di/auth.container';
import {
  requestBodyToRegisterUseCaseInput,
} from '@modules/auth/presentation/http/request-mappers/auth/request-body-to-auth-use-case-input';
import { mapAuthHttpResponse } from '@modules/auth/presentation/http/http-responses/map-auth-response';
import { registerPayloadSchema } from '@modules/auth/presentation/http/validation/schemas/register-payload.schema';
import {
  getRequestMeta,
  handleRouteError,
  jsonResult,
} from '@shared/presentation/http';

export async function POST(request: Request) {
  try {
    const body = registerPayloadSchema.parse(await request.json());
    const meta = getRequestMeta(request);
    const { register } = createAuthContainer();
    const output = await register.execute(
      requestBodyToRegisterUseCaseInput(body, meta),
    );
    return jsonResult(mapAuthHttpResponse(output), { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
