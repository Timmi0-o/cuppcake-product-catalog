import { DomainError } from '@shared/domain/errors';
import { IMAGE_ENTITY_CONFIG } from './image-entity-config';
import type { ImageEntityType } from '../i-image.entity';

export class ImageMaxCountExceededError extends DomainError {
  constructor(entityType: ImageEntityType, maxCount: number, attempted: number) {
    super(
      'IMAGE_MAX_COUNT_EXCEEDED',
      `Max ${maxCount} images allowed for ${entityType}, attempted ${attempted}`,
      { entityType, maxCount, attempted },
    );
  }
}

export function ensureImageMaxCount(
  entityType: ImageEntityType,
  currentCount: number,
  addingCount: number,
): void {
  const { maxCount } = IMAGE_ENTITY_CONFIG[entityType];
  const next = currentCount + addingCount;
  if (next > maxCount) {
    throw new ImageMaxCountExceededError(entityType, maxCount, next);
  }
}
