import { createAuthContainer } from '@/lib/di/auth.container';
import { createProductsContainer } from '@/lib/di/products.container';
import {
  requestBodyToDeleteProductImagesUseCaseInput,
  requestMultipartToUploadProductImagesUseCaseInput,
} from '@modules/products/presentation/http/request-mappers/product/request-to-product-use-case-input';
import { mapProductImagesHttpResponse } from '@modules/products/presentation/http/http-responses/map-product-response';
import {
  deleteProductImagesPayloadSchema,
  productIdParamsSchema,
} from '@modules/products/presentation/http/validation/schemas/product.schemas';
import {
  handleRouteError,
  jsonError,
  jsonResult,
  requireBearerUser,
} from '@shared/presentation/http';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { tokenService } = createAuthContainer();
    const actor = await requireBearerUser(request, (token) =>
      tokenService.verifyAccessToken(token),
    );

    const { id } = productIdParamsSchema.parse(await context.params);
    const formData = await request.formData();
    const entries = formData.getAll('files');
    const files: Array<{ originalName: string; buffer: Buffer }> = [];

    for (const entry of entries) {
      if (!(entry instanceof File)) {
        continue;
      }
      const arrayBuffer = await entry.arrayBuffer();
      files.push({
        originalName: entry.name,
        buffer: Buffer.from(arrayBuffer),
      });
    }

    if (files.length === 0) {
      return jsonError(400, 'No files provided', 'VALIDATION_ERROR');
    }

    const { uploadProductImages } = createProductsContainer();
    const output = await uploadProductImages.execute(
      requestMultipartToUploadProductImagesUseCaseInput({
        productIdOrSlug: id,
        actor,
        files,
      }),
    );
    return jsonResult(mapProductImagesHttpResponse(output), { status: 201 });
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
    const body = deleteProductImagesPayloadSchema.parse(await request.json());
    const { deleteProductImages } = createProductsContainer();
    const output = await deleteProductImages.execute(
      requestBodyToDeleteProductImagesUseCaseInput(id, body),
    );
    return jsonResult(output);
  } catch (error) {
    return handleRouteError(error);
  }
}
