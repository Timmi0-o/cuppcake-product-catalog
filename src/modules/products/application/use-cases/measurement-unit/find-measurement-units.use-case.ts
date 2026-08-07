import type { IMeasurementUnitPublicEntity } from '../../../domain/entities/measurement-unit';
import type { IMeasurementUnitRepository } from '../../../domain/repositories/measurement-unit/i-measurement-unit.repository';

export class FindMeasurementUnitsUseCase {
  constructor(
    private readonly measurementUnitRepository: IMeasurementUnitRepository,
  ) {}

  async execute(): Promise<IMeasurementUnitPublicEntity[]> {
    return this.measurementUnitRepository.findManyPublic();
  }
}
