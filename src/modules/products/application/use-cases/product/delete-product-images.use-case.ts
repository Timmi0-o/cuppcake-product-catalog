import type { IFileRepository } from '@modules/files/domain/repositories/file';
import type { IFileStoragePort } from '@modules/files/application/ports/i-file-storage.port';
import type { ITransactionManager } from '@shared/domain/transactions';
import { ImageEntityType } from '../../../domain/entities/image';
import { ProductNotFoundError } from '../../../domain/entities/product';
import type { IImageRepository } from '../../../domain/repositories/image/i-image.repository';
import type { IProductRepository } from '../../../domain/repositories/product/i-product.repository';
import type { IDeleteProductImagesApplicationInput } from '../../dtos/product.dtos';

export class DeleteProductImagesUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly productRepository: IProductRepository,
    private readonly imageRepository: IImageRepository,
    private readonly fileRepository: IFileRepository,
    private readonly fileStorage: IFileStoragePort,
  ) {}

  async execute(
    input: IDeleteProductImagesApplicationInput,
  ): Promise<{ success: true; deletedFileIds: string[] }> {
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      throw new ProductNotFoundError(input.productId);
    }

    const images = await this.imageRepository.findByEntityAndFileIds(
      ImageEntityType.PRODUCT,
      input.productId,
      input.fileIds,
    );
    const fileIds = images.map((image) => image.fileId);
    const files = await this.fileRepository.findByIds(fileIds);

    await this.transactionManager.runInTransaction(async (scope) => {
      await this.imageRepository.deleteByEntityAndFileIds(
        ImageEntityType.PRODUCT,
        input.productId,
        fileIds,
        scope,
      );
      await this.fileRepository.softDeleteMany(fileIds, scope);
    });

    await Promise.all(
      files.map((file) => this.fileStorage.deleteByPublicUrl(file.fileUrl)),
    );

    return { success: true, deletedFileIds: fileIds };
  }
}
