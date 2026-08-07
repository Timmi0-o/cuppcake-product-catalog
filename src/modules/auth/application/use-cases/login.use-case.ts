import bcrypt from 'bcryptjs';
import type { IUserRepository } from '@modules/users/domain/repositories/user';
import type { ITransactionManager } from '@shared/domain/transactions';
import { InvalidCredentialsError } from '../../domain/entities/refresh-token';
import type { IRefreshTokenRepository } from '../../domain/repositories/i-refresh-token.repository';
import type { ISessionRepository } from '../../domain/repositories/i-session.repository';
import type { TokenService } from '../../infrastructure/services/token.service';
import type { ILoginApplicationInput } from '../dtos/i-login-input.dto';
import type { ILoginApplicationOutput } from '../dtos/i-login-output.dto';

export class LoginUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    input: ILoginApplicationInput,
  ): Promise<ILoginApplicationOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!passwordValid) {
      throw new InvalidCredentialsError();
    }

    return this.transactionManager.runInTransaction(async (scope) => {
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
