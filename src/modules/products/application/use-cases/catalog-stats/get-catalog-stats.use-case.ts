import type { ICatalogStatsRepository } from "../../../domain/repositories/catalog-stats/i-catalog-stats.repository";
import type { IGetCatalogStatsApplicationOutput } from "../../dtos/i-get-catalog-stats-output.dto";

export class GetCatalogStatsUseCase {
  constructor(
    private readonly catalogStatsRepository: ICatalogStatsRepository,
  ) {}

  async execute(): Promise<IGetCatalogStatsApplicationOutput> {
    return this.catalogStatsRepository.getStats();
  }
}
