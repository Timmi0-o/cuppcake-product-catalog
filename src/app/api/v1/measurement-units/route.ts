import { createProductsContainer } from '@/lib/di/products.container';
import { mapMeasurementUnitsHttpResponse } from '@modules/products/presentation/http/http-responses/map-product-response';
import { handleRouteError, jsonResult } from '@shared/presentation/http';

export async function GET() {
  try {
    const { findMeasurementUnits } = createProductsContainer();
    const output = await findMeasurementUnits.execute();
    return jsonResult(mapMeasurementUnitsHttpResponse(output));
  } catch (error) {
    return handleRouteError(error);
  }
}
