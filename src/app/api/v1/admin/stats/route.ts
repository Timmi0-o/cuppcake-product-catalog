import { mapCatalogStatsHttpResponse } from "@modules/products/presentation/http/http-responses/map-catalog-stats-response";
import {
  handleRouteError,
  jsonResult,
  requireBearerUser,
} from "@shared/presentation/http";
import { createAuthContainer } from "@/lib/di/auth.container";
import { createProductsContainer } from "@/lib/di/products.container";

export async function GET(request: Request) {
  try {
    const { tokenService } = createAuthContainer();
    await requireBearerUser(request, (token) =>
      tokenService.verifyAccessToken(token),
    );

    const { getCatalogStats } = createProductsContainer();
    const output = await getCatalogStats.execute();
    return jsonResult(mapCatalogStatsHttpResponse(output));
  } catch (error) {
    return handleRouteError(error);
  }
}
