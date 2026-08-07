import { PrismaFileRepository } from '@modules/files/infrastructure/persistence/repositories/file/prisma-file.repository';
import { LocalDiskFileStorage } from '@modules/files/infrastructure/storage/local-disk-file-storage';
import { CreateProductUseCase } from '@modules/products/application/use-cases/product/create-product.use-case';
import { DeleteProductImagesUseCase } from '@modules/products/application/use-cases/product/delete-product-images.use-case';
import { DeleteProductUseCase } from '@modules/products/application/use-cases/product/delete-product.use-case';
import { FindProductsUseCase } from '@modules/products/application/use-cases/product/find-products.use-case';
import { GetProductByIdUseCase } from '@modules/products/application/use-cases/product/get-product-by-id.use-case';
import { UpdateProductUseCase } from '@modules/products/application/use-cases/product/update-product.use-case';
import { UploadProductImagesUseCase } from '@modules/products/application/use-cases/product/upload-product-images.use-case';
import { PrismaImageRepository } from '@modules/products/infrastructure/persistence/repositories/image/prisma-image.repository';
import { PrismaProductRepository } from '@modules/products/infrastructure/persistence/repositories/product/prisma-product.repository';
import { getPrismaClient } from '@shared/infrastructure/persistence/prisma';
import { PrismaTransactionManager } from '@shared/infrastructure/persistence/transactions';

export function createProductsContainer() {
  const prisma = getPrismaClient();
  const transactionManager = new PrismaTransactionManager(prisma);
  const productRepository = new PrismaProductRepository(prisma);
  const imageRepository = new PrismaImageRepository(prisma);
  const fileRepository = new PrismaFileRepository(prisma);
  const fileStorage = new LocalDiskFileStorage();

  return {
    createProduct: new CreateProductUseCase(
      transactionManager,
      productRepository,
    ),
    updateProduct: new UpdateProductUseCase(
      transactionManager,
      productRepository,
    ),
    getProductById: new GetProductByIdUseCase(productRepository),
    findProducts: new FindProductsUseCase(productRepository),
    deleteProduct: new DeleteProductUseCase(
      transactionManager,
      productRepository,
    ),
    uploadProductImages: new UploadProductImagesUseCase(
      transactionManager,
      productRepository,
      imageRepository,
      fileRepository,
      fileStorage,
    ),
    deleteProductImages: new DeleteProductImagesUseCase(
      transactionManager,
      productRepository,
      imageRepository,
      fileRepository,
      fileStorage,
    ),
  };
}

export type ProductsContainer = ReturnType<typeof createProductsContainer>;
