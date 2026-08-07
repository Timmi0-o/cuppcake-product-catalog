import bcrypt from 'bcryptjs';
import type { IUserRepository } from '@modules/users/domain/repositories/user';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IRefreshTokenRepository } from '../../domain/repositories/i-refresh-token.repository';
import type { ISessionRepository } from '../../domain/repositories/i-session.repository';
import type { TokenService } from '../../infrastructure/services/token.service';
import type { IRegisterApplicationInput } from '../dtos/i-register-input.dto';
import type { IRegisterApplicationOutput } from '../dtos/i-register-output.dto';

export class RegisterUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    input: IRegisterApplicationInput,
  ): Promise<IRegisterApplicationOutput> {
    const passwordHash = await bcrypt.hash(input.password, 10);

    return this.transactionManager.runInTransaction(async (scope) => {
      const user = await this.userRepository.create(
        {
          email: input.email,
          passwordHash,
        },
        scope,
      );

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
