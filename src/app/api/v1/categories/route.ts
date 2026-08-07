import { createAuthContainer } from '@/lib/di/auth.container';
import { createProductsContainer } from '@/lib/di/products.container';
import { requestBodyToCreateCategoryUseCaseInput } from '@modules/products/presentation/http/request-mappers/product/request-to-product-use-case-input';
import { mapCategoriesHttpResponse } from '@modules/products/presentation/http/http-responses/map-product-response';
import { createCategoryPayloadSchema } from '@modules/products/presentation/http/validation/schemas/product.schemas';
import {
  handleRouteError,
  jsonResult,
  requireBearerUser,
} from '@shared/presentation/http';

export async function GET() {
  try {
    const { findCategories } = createProductsContainer();
    const output = await findCategories.execute();
    return jsonResult(mapCategoriesHttpResponse(output));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { tokenService } = createAuthContainer();
    await requireBearerUser(request, (token) =>
      tokenService.verifyAccessToken(token),
    );

    const body = createCategoryPayloadSchema.parse(await request.json());
    const { createCategory } = createProductsContainer();
    const output = await createCategory.execute(
      requestBodyToCreateCategoryUseCaseInput(body),
    );
    return jsonResult(output, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
