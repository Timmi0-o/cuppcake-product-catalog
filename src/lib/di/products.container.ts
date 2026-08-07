import { SharpImageVariantProcessor } from "@modules/files/infrastructure/image-processing/sharp-image-variant-processor";
import { PrismaFileRepository } from "@modules/files/infrastructure/persistence/repositories/file/prisma-file.repository";
import { LocalDiskFileStorage } from "@modules/files/infrastructure/storage/local-disk-file-storage";
import { CreateCategoryUseCase } from "@modules/products/application/use-cases/category/create-category.use-case";
import { FindCategoriesUseCase } from "@modules/products/application/use-cases/category/find-categories.use-case";
import { FindMeasurementUnitsUseCase } from "@modules/products/application/use-cases/measurement-unit/find-measurement-units.use-case";
import { CreateProductUseCase } from "@modules/products/application/use-cases/product/create-product.use-case";
import { DeleteProductUseCase } from "@modules/products/application/use-cases/product/delete-product.use-case";
import { DeleteProductImagesUseCase } from "@modules/products/application/use-cases/product/delete-product-images.use-case";
import { FindProductsUseCase } from "@modules/products/application/use-cases/product/find-products.use-case";
import { GetProductByIdUseCase } from "@modules/products/application/use-cases/product/get-product-by-id.use-case";
import { UpdateProductUseCase } from "@modules/products/application/use-cases/product/update-product.use-case";
import { UploadProductImagesUseCase } from "@modules/products/application/use-cases/product/upload-product-images.use-case";
import { FindProductCollectionsUseCase } from "@modules/products/application/use-cases/product-collection/find-product-collections.use-case";
import { PrismaCategoryRepository } from "@modules/products/infrastructure/persistence/repositories/category/prisma-category.repository";
import { PrismaImageRepository } from "@modules/products/infrastructure/persistence/repositories/image/prisma-image.repository";
import { PrismaMeasurementUnitRepository } from "@modules/products/infrastructure/persistence/repositories/measurement-unit/prisma-measurement-unit.repository";
import { PrismaProductRepository } from "@modules/products/infrastructure/persistence/repositories/product/prisma-product.repository";
import { PrismaProductCollectionRepository } from "@modules/products/infrastructure/persistence/repositories/product-collection/prisma-product-collection.repository";
import { getPrismaClient } from "@shared/infrastructure/persistence/prisma";
import { PrismaTransactionManager } from "@shared/infrastructure/persistence/transactions";

export function createProductsContainer() {
  const prisma = getPrismaClient();
  const transactionManager = new PrismaTransactionManager(prisma);
  const productRepository = new PrismaProductRepository(prisma);
  const categoryRepository = new PrismaCategoryRepository(prisma);
  const productCollectionRepository = new PrismaProductCollectionRepository(
    prisma,
  );
  const measurementUnitRepository = new PrismaMeasurementUnitRepository(prisma);
  const imageRepository = new PrismaImageRepository(prisma);
  const fileRepository = new PrismaFileRepository(prisma);
  const fileStorage = new LocalDiskFileStorage();
  const imageVariantProcessor = new SharpImageVariantProcessor();

  return {
    createProduct: new CreateProductUseCase(
      transactionManager,
      productRepository,
      categoryRepository,
      measurementUnitRepository,
      productCollectionRepository,
    ),
    updateProduct: new UpdateProductUseCase(
      transactionManager,
      productRepository,
      categoryRepository,
      measurementUnitRepository,
      productCollectionRepository,
    ),
    getProductById: new GetProductByIdUseCase(productRepository),
    findProducts: new FindProductsUseCase(
      productRepository,
      categoryRepository,
    ),
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
      imageVariantProcessor,
    ),
    deleteProductImages: new DeleteProductImagesUseCase(
      transactionManager,
      productRepository,
      imageRepository,
      fileRepository,
      fileStorage,
    ),
    findCategories: new FindCategoriesUseCase(categoryRepository),
    createCategory: new CreateCategoryUseCase(
      transactionManager,
      categoryRepository,
    ),
    findProductCollections: new FindProductCollectionsUseCase(
      productCollectionRepository,
    ),
    findMeasurementUnits: new FindMeasurementUnitsUseCase(
      measurementUnitRepository,
    ),
  };
}

export type ProductsContainer = ReturnType<typeof createProductsContainer>;
