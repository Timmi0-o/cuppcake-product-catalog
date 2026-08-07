import type {
  IMeasurementUnitEntity,
  IMeasurementUnitPublicEntity,
} from '../../entities/measurement-unit';

export interface IMeasurementUnitRepository {
  findManyPublic(): Promise<IMeasurementUnitPublicEntity[]>;
  findById(id: string): Promise<IMeasurementUnitEntity | null>;
}

export const MEASUREMENT_UNIT_REPOSITORY_TOKEN = Symbol(
  'IMeasurementUnitRepository',
);
