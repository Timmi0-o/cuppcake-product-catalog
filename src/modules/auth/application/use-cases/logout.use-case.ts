import type { IRefreshTokenRepository } from '../../domain/repositories/i-refresh-token.repository';
import type { TokenService } from '../../infrastructure/services/token.service';
import type { ILogoutApplicationInput } from '../dtos/i-logout-input.dto';
import type { ILogoutApplicationOutput } from '../dtos/i-logout-output.dto';

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    input: ILogoutApplicationInput,
  ): Promise<ILogoutApplicationOutput> {
    if (input.refreshToken) {
      const tokenHash = this.tokenService.hashToken(input.refreshToken);
      await this.refreshTokenRepository.revokeByTokenHash(tokenHash);
    } else {
      await this.refreshTokenRepository.revokeAllForUser(input.userId);
    }

    return { success: true };
  }
}
