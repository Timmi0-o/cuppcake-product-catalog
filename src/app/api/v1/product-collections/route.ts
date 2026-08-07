import { createProductsContainer } from '@/lib/di/products.container';
import { mapProductCollectionsHttpResponse } from '@modules/products/presentation/http/http-responses/map-product-response';
import { handleRouteError, jsonResult } from '@shared/presentation/http';

export async function GET() {
  try {
    const { findProductCollections } = createProductsContainer();
    const output = await findProductCollections.execute();
    return jsonResult(mapProductCollectionsHttpResponse(output));
  } catch (error) {
    return handleRouteError(error);
  }
}
