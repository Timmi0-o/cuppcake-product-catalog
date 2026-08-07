import type { MeasurementUnit, PrismaClient } from '@prisma/client';
import type {
  IMeasurementUnitEntity,
  IMeasurementUnitPublicEntity,
} from '@modules/products/domain/entities/measurement-unit';
import type { IMeasurementUnitRepository } from '@modules/products/domain/repositories/measurement-unit/i-measurement-unit.repository';

function mapUnitRow(row: MeasurementUnit): IMeasurementUnitEntity {
  return {
    id: row.id,
    name: row.name,
    symbol: row.symbol,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaMeasurementUnitRepository
  implements IMeasurementUnitRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async findManyPublic(): Promise<IMeasurementUnitPublicEntity[]> {
    const rows = await this.prisma.measurementUnit.findMany({
      orderBy: { symbol: 'asc' },
    });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      symbol: row.symbol,
    }));
  }

  async findById(id: string): Promise<IMeasurementUnitEntity | null> {
    const row = await this.prisma.measurementUnit.findUnique({ where: { id } });
    return row ? mapUnitRow(row) : null;
  }
}
