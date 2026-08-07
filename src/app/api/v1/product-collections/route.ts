import { mapProductCollectionsListHttpResponse } from "@modules/products/presentation/http/http-responses/map-product-response";
import { requestQueryParamsToFindProductCollectionsUseCaseInput } from "@modules/products/presentation/http/request-mappers/product-collection/request-to-product-collection-use-case-input";
import { findProductCollectionsQuerySchema } from "@modules/products/presentation/http/validation/schemas/product-collection.schemas";
import { handleRouteError, jsonResult } from "@shared/presentation/http";
import { createProductsContainer } from "@/lib/di/products.container";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = findProductCollectionsQuerySchema.parse({
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });

    const { findProductCollections } = createProductsContainer();
    const useCaseInput =
      requestQueryParamsToFindProductCollectionsUseCaseInput(query);
    const output = await findProductCollections.execute(useCaseInput);

    return jsonResult(
      mapProductCollectionsListHttpResponse(output, {
        page: useCaseInput.page,
        limit: useCaseInput.limit,
      }),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
