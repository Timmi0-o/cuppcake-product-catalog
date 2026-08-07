import { createAuthContainer } from '@/lib/di/auth.container';
import { createProductsContainer } from '@/lib/di/products.container';
import {
  requestBodyToUpdateProductUseCaseInput,
  requestParamsToDeleteProductUseCaseInput,
  requestParamsToGetProductByIdUseCaseInput,
} from '@modules/products/presentation/http/request-mappers/product/request-to-product-use-case-input';
import { mapProductHttpResponse } from '@modules/products/presentation/http/http-responses/map-product-response';
import {
  productIdParamsSchema,
  updateProductPayloadSchema,
} from '@modules/products/presentation/http/validation/schemas/product.schemas';
import {
  handleRouteError,
  jsonResult,
  requireBearerUser,
} from '@shared/presentation/http';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { tokenService } = createAuthContainer();
    await requireBearerUser(request, (token) =>
      tokenService.verifyAccessToken(token),
    );

    const { id } = productIdParamsSchema.parse(await context.params);
    const url = new URL(request.url);
    const includeImages = url.searchParams.get('includeImages');
    const { getProductById } = createProductsContainer();
    const output = await getProductById.execute(
      requestParamsToGetProductByIdUseCaseInput(
        id,
        includeImages === null ? true : includeImages === 'true',
      ),
    );
    return jsonResult(mapProductHttpResponse(output));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { tokenService } = createAuthContainer();
    await requireBearerUser(request, (token) =>
      tokenService.verifyAccessToken(token),
    );

    const { id } = productIdParamsSchema.parse(await context.params);
    const body = updateProductPayloadSchema.parse(await request.json());
    const { updateProduct } = createProductsContainer();
    const output = await updateProduct.execute(
      requestBodyToUpdateProductUseCaseInput(id, body),
    );
    return jsonResult(mapProductHttpResponse(output));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { tokenService } = createAuthContainer();
    await requireBearerUser(request, (token) =>
      tokenService.verifyAccessToken(token),
    );

    const { id } = productIdParamsSchema.parse(await context.params);
    const { deleteProduct } = createProductsContainer();
    const output = await deleteProduct.execute(
      requestParamsToDeleteProductUseCaseInput(id),
    );
    return jsonResult(output);
  } catch (error) {
    return handleRouteError(error);
  }
}
