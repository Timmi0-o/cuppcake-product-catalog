import { mapProductCollectionHttpResponse } from "@modules/products/presentation/http/http-responses/map-product-response";
import { requestParamsToGetProductCollectionByIdUseCaseInput } from "@modules/products/presentation/http/request-mappers/product-collection/request-to-product-collection-use-case-input";
import { productCollectionIdParamsSchema } from "@modules/products/presentation/http/validation/schemas/product-collection.schemas";
import { handleRouteError, jsonResult } from "@shared/presentation/http";
import { createProductsContainer } from "@/lib/di/products.container";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const rawParams = await context.params;
    const params = productCollectionIdParamsSchema.parse(rawParams);

    const { getProductCollectionById } = createProductsContainer();
    const output = await getProductCollectionById.execute(
      requestParamsToGetProductCollectionByIdUseCaseInput(params),
    );

    return jsonResult(mapProductCollectionHttpResponse(output));
  } catch (error) {
    return handleRouteError(error);
  }
}
