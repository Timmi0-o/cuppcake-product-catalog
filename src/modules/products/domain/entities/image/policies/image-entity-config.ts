import { FilePurpose, FileType } from '@modules/files/domain/entities/file';
import { ImageEntityType } from '../i-image.entity';

export type ImageEntityConfig = {
  maxCount: number;
  purpose: FilePurpose;
  fileType: FileType;
};

export const IMAGE_ENTITY_CONFIG: Record<ImageEntityType, ImageEntityConfig> = {
  [ImageEntityType.PRODUCT]: {
    maxCount: 10,
    purpose: FilePurpose.PRODUCT_IMAGE,
    fileType: FileType.IMAGE,
  },
};
