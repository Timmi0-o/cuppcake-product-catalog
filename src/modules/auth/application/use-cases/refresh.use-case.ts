import { UserNotFoundError } from '@modules/users/domain/entities/user';
import type { IUserRepository } from '@modules/users/domain/repositories/user';
import type { ITransactionManager } from '@shared/domain/transactions';
import { RefreshTokenInvalidError } from '../../domain/entities/refresh-token';
import type { IRefreshTokenRepository } from '../../domain/repositories/i-refresh-token.repository';
import type { ISessionRepository } from '../../domain/repositories/i-session.repository';
import type { TokenService } from '../../infrastructure/services/token.service';
import type { IRefreshApplicationInput } from '../dtos/i-refresh-input.dto';
import type { IRefreshApplicationOutput } from '../dtos/i-refresh-output.dto';

export class RefreshUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    input: IRefreshApplicationInput,
  ): Promise<IRefreshApplicationOutput> {
    let userId: string;
    try {
      ({ userId } = await this.tokenService.verifyRefreshToken(
        input.refreshToken,
      ));
    } catch {
      throw new RefreshTokenInvalidError();
    }

    const tokenHash = this.tokenService.hashToken(input.refreshToken);
    const stored = await this.refreshTokenRepository.findValidByTokenHash(
      tokenHash,
    );
    if (!stored || stored.userId !== userId) {
      throw new RefreshTokenInvalidError();
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return this.transactionManager.runInTransaction(async (scope) => {
      await this.refreshTokenRepository.revokeByTokenHash(tokenHash, scope);

      const tokens = await this.tokenService.issueTokenPair({
        userId: user.id,
        email: user.email,
      });

      await this.refreshTokenRepository.create(
        {
          userId: user.id,
          tokenHash: this.tokenService.hashToken(tokens.refreshToken),
          expiresAt: this.tokenService.getRefreshTokenExpiresAt(),
        },
        scope,
      );

      await this.sessionRepository.create(
        {
          userId: user.id,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
        scope,
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        tokens,
      };
    });
  }
}
