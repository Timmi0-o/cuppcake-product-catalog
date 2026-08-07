import { createAuthContainer } from '@/lib/di/auth.container';
import { createProductsContainer } from '@/lib/di/products.container';
import {
  requestBodyToCreateProductUseCaseInput,
  requestQueryParamsToFindProductsUseCaseInput,
} from '@modules/products/presentation/http/request-mappers/product/request-to-product-use-case-input';
import {
  mapProductHttpResponse,
  mapProductsListHttpResponse,
} from '@modules/products/presentation/http/http-responses/map-product-response';
import {
  createProductPayloadSchema,
  findProductsQuerySchema,
} from '@modules/products/presentation/http/validation/schemas/product.schemas';
import {
  handleRouteError,
  jsonResult,
  requireBearerUser,
} from '@shared/presentation/http';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = findProductsQuerySchema.parse({
      name: url.searchParams.get('name') ?? undefined,
      search: url.searchParams.get('search') ?? undefined,
      categoryId: url.searchParams.get('categoryId') ?? undefined,
      categorySlug: url.searchParams.get('categorySlug') ?? undefined,
      collectionId: url.searchParams.get('collectionId') ?? undefined,
      page: url.searchParams.get('page') ?? undefined,
      limit: url.searchParams.get('limit') ?? undefined,
      includeImages: url.searchParams.get('includeImages') ?? undefined,
    });

    const { findProducts } = createProductsContainer();
    const useCaseInput = requestQueryParamsToFindProductsUseCaseInput(query);
    const output = await findProducts.execute(useCaseInput);
    return jsonResult(
      mapProductsListHttpResponse(output, {
        page: useCaseInput.page,
        limit: useCaseInput.limit,
      }),
    );
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

    const body = createProductPayloadSchema.parse(await request.json());
    const { createProduct } = createProductsContainer();
    const output = await createProduct.execute(
      requestBodyToCreateProductUseCaseInput(body),
    );
    return jsonResult(mapProductHttpResponse(output), { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
