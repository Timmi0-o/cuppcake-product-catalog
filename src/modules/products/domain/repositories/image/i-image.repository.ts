import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateImageInput,
  IImageEntity,
  ImageEntityType,
} from '../../entities/image';

export interface IImageRepository {
  createMany(
    inputs: ICreateImageInput[],
    scope?: TransactionScope,
  ): Promise<IImageEntity[]>;
  countByEntity(
    entityType: ImageEntityType,
    entityId: string,
  ): Promise<number>;
  findByEntityAndFileIds(
    entityType: ImageEntityType,
    entityId: string,
    fileIds: string[],
  ): Promise<IImageEntity[]>;
  deleteByEntityAndFileIds(
    entityType: ImageEntityType,
    entityId: string,
    fileIds: string[],
    scope?: TransactionScope,
  ): Promise<void>;
}

export const IMAGE_REPOSITORY_TOKEN = Symbol('IImageRepository');
