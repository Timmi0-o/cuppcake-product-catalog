import type { IFileStoragePort } from "@modules/files/application/ports/i-file-storage.port";
import type { IImageVariantProcessorPort } from "@modules/files/application/ports/i-image-variant-processor.port";
import {
  FilePurpose,
  FileStatus,
  FileTooLargeError,
  FileType,
  type ProductImageFileMetadata,
} from "@modules/files/domain/entities/file";
import type { IFileRepository } from "@modules/files/domain/repositories/file";
import { calculateChecksum } from "@modules/files/infrastructure/storage/local-disk-file-storage";
import type { ITransactionManager } from "@shared/domain/transactions";
import { appConfig } from "@shared/infrastructure/config";
import {
  ensureImageMaxCount,
  IMAGE_ENTITY_CONFIG,
  ImageEntityType,
} from "../../../domain/entities/image";
import {
  type IProductImagePublic,
  ProductNotFoundError,
} from "../../../domain/entities/product";
import type { IImageRepository } from "../../../domain/repositories/image/i-image.repository";
import type { IProductRepository } from "../../../domain/repositories/product/i-product.repository";
import type { IUploadProductImagesApplicationInput } from "../../dtos/product.dtos";

export class UploadProductImagesUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly productRepository: IProductRepository,
    private readonly imageRepository: IImageRepository,
    private readonly fileRepository: IFileRepository,
    private readonly fileStorage: IFileStoragePort,
    private readonly imageVariantProcessor: IImageVariantProcessorPort,
  ) {}

  async execute(
    input: IUploadProductImagesApplicationInput,
  ): Promise<IProductImagePublic[]> {
    const product = await this.productRepository.findByIdOrSlug(
      input.productIdOrSlug,
    );
    if (!product) {
      throw new ProductNotFoundError(input.productIdOrSlug);
    }

    const currentCount = await this.imageRepository.countByEntity(
      ImageEntityType.PRODUCT,
      product.id,
    );
    ensureImageMaxCount(
      ImageEntityType.PRODUCT,
      currentCount,
      input.files.length,
    );

    const config = IMAGE_ENTITY_CONFIG[ImageEntityType.PRODUCT];
    const relativeDirectory = `products/${product.id}`;

    type PreparedUpload = {
      originalName: string;
      originalMimeType: string;
      originalFileName: string;
      originalFileSize: bigint;
      originalChecksum: string;
      originalPublicUrl: string;
      urls: string[];
    };

    const preparedUploads: PreparedUpload[] = [];

    for (const file of input.files) {
      if (file.buffer.byteLength > appConfig.uploadMaxFileSizeBytes) {
        throw new FileTooLargeError(
          file.buffer.byteLength,
          appConfig.uploadMaxFileSizeBytes,
        );
      }

      const processed = await this.imageVariantProcessor.process({
        buffer: file.buffer,
        originalName: file.originalName,
      });

      const urls: string[] = [];
      let originalPublicUrl = "";
      let originalFileName = "";
      let originalMimeType = "";
      let originalFileSize = 0n;
      let originalChecksum = "";

      for (const variantFile of processed.files) {
        const saved = await this.fileStorage.save({
          relativeDirectory,
          fileName: variantFile.fileName,
          buffer: variantFile.buffer,
        });
        urls.push(saved.publicUrl);

        if (variantFile.variant === "original") {
          originalPublicUrl = saved.publicUrl;
          originalFileName = variantFile.fileName;
          originalMimeType = variantFile.mimeType;
          originalFileSize = BigInt(variantFile.buffer.byteLength);
          originalChecksum = calculateChecksum(variantFile.buffer);
        }
      }

      preparedUploads.push({
        originalName: processed.originalName,
        originalMimeType,
        originalFileName,
        originalFileSize,
        originalChecksum,
        originalPublicUrl,
        urls,
      });
    }

    return this.transactionManager.runInTransaction(async (scope) => {
      const files = await this.fileRepository.createMany(
        preparedUploads.map((upload) => {
          const metadata: ProductImageFileMetadata = { urls: upload.urls };
          return {
            uploadedBy: input.actorUserId,
            fileName: upload.originalFileName,
            originalName: upload.originalName,
            mimeType: upload.originalMimeType,
            fileSize: upload.originalFileSize,
            fileUrl: upload.originalPublicUrl,
            checksum: upload.originalChecksum,
            status: FileStatus.UPLOADED,
            fileType: config.fileType ?? FileType.IMAGE,
            purpose: config.purpose ?? FilePurpose.PRODUCT_IMAGE,
            metadata,
            tags: [],
          };
        }),
        scope,
      );

      const images = await this.imageRepository.createMany(
        files.map((file) => ({
          entityType: ImageEntityType.PRODUCT,
          entityId: product.id,
          fileId: file.id,
        })),
        scope,
      );

      return images.map((image, index) => {
        const file = files[index];
        const upload = preparedUploads[index];
        if (!file || !upload) {
          throw new Error("Upload mapping mismatch between files and images");
        }
        return {
          id: image.id,
          fileId: file.id,
          fileUrl: file.fileUrl,
          urls: upload.urls,
          originalName: file.originalName,
          mimeType: file.mimeType,
          status: file.status,
          fileSize: file.fileSize.toString(),
          createdAt: image.createdAt,
        };
      });
    });
  }
}
