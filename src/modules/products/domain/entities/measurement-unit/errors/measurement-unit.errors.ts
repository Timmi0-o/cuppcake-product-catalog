import { DomainError } from '@shared/domain/errors';

export class MeasurementUnitNotFoundError extends DomainError {
  constructor(measurementUnitId: string) {
    super(
      'MEASUREMENT_UNIT_NOT_FOUND',
      `Measurement unit not found: ${measurementUnitId}`,
      { measurementUnitId },
    );
  }
}
