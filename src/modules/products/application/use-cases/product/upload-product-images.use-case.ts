import { randomUUID } from 'node:crypto';
import {
  FilePurpose,
  FileStatus,
  FileTooLargeError,
  FileType,
  InvalidFileTypeError,
} from '@modules/files/domain/entities/file';
import type { IFileRepository } from '@modules/files/domain/repositories/file';
import type { IFileStoragePort } from '@modules/files/application/ports/i-file-storage.port';
import {
  calculateChecksum,
  detectImageMimeType,
  extensionForMime,
} from '@modules/files/infrastructure/storage/local-disk-file-storage';
import { appConfig } from '@shared/infrastructure/config';
import type { ITransactionManager } from '@shared/domain/transactions';
import {
  ensureImageMaxCount,
  IMAGE_ENTITY_CONFIG,
  ImageEntityType,
} from '../../../domain/entities/image';
import {
  ProductNotFoundError,
  type IProductImagePublic,
} from '../../../domain/entities/product';
import type { IImageRepository } from '../../../domain/repositories/image/i-image.repository';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { IUploadProductImagesApplicationInput } from '../../dtos/product.dtos';

export class UploadProductImagesUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly productRepository: IProductRepository,
    private readonly imageRepository: IImageRepository,
    private readonly fileRepository: IFileRepository,
    private readonly fileStorage: IFileStoragePort,
  ) {}

  async execute(
    input: IUploadProductImagesApplicationInput,
  ): Promise<IProductImagePublic[]> {
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      throw new ProductNotFoundError(input.productId);
    }

    const currentCount = await this.imageRepository.countByEntity(
      ImageEntityType.PRODUCT,
      input.productId,
    );
    ensureImageMaxCount(
      ImageEntityType.PRODUCT,
      currentCount,
      input.files.length,
    );

    const config = IMAGE_ENTITY_CONFIG[ImageEntityType.PRODUCT];
    const prepared = input.files.map((file) => {
      if (file.buffer.byteLength > appConfig.uploadMaxFileSizeBytes) {
        throw new FileTooLargeError(
          file.buffer.byteLength,
          appConfig.uploadMaxFileSizeBytes,
        );
      }

      const mimeType = detectImageMimeType(file.buffer);
      if (!mimeType) {
        throw new InvalidFileTypeError(file.originalName);
      }

      const fileName = `${randomUUID()}.${extensionForMime(mimeType)}`;
      return {
        originalName: file.originalName,
        buffer: file.buffer,
        mimeType,
        fileName,
        checksum: calculateChecksum(file.buffer),
        fileSize: BigInt(file.buffer.byteLength),
      };
    });

    const savedFiles: Array<{
      originalName: string;
      buffer: Buffer;
      mimeType: string;
      fileName: string;
      checksum: string;
      fileSize: bigint;
      publicUrl: string;
    }> = [];
    for (const file of prepared) {
      const saved = await this.fileStorage.save({
        relativeDirectory: `products/${input.productId}`,
        fileName: file.fileName,
        buffer: file.buffer,
      });
      savedFiles.push({ ...file, publicUrl: saved.publicUrl });
    }

    return this.transactionManager.runInTransaction(async (scope) => {
      const files = await this.fileRepository.createMany(
        savedFiles.map((file) => ({
          uploadedBy: input.actorUserId,
          fileName: file.fileName,
          originalName: file.originalName,
          mimeType: file.mimeType,
          fileSize: file.fileSize,
          fileUrl: file.publicUrl,
          checksum: file.checksum,
          status: FileStatus.UPLOADED,
          fileType: config.fileType ?? FileType.IMAGE,
          purpose: config.purpose ?? FilePurpose.PRODUCT_IMAGE,
          metadata: null,
          tags: [],
        })),
        scope,
      );

      const images = await this.imageRepository.createMany(
        files.map((file) => ({
          entityType: ImageEntityType.PRODUCT,
          entityId: input.productId,
          fileId: file.id,
        })),
        scope,
      );

      return images.map((image, index) => {
        const file = files[index];
        return {
          id: image.id,
          fileId: file.id,
          fileUrl: file.fileUrl,
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
