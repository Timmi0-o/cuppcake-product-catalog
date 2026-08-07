import { getPrismaClient } from '@shared/infrastructure/persistence/prisma';
import { PrismaTransactionManager } from '@shared/infrastructure/persistence/transactions';
import { PrismaUserRepository } from '@modules/users/infrastructure/persistence/repositories/user/prisma-user.repository';
import { PrismaRefreshTokenRepository } from '@modules/auth/infrastructure/persistence/repositories/prisma-refresh-token.repository';
import { PrismaSessionRepository } from '@modules/auth/infrastructure/persistence/repositories/prisma-session.repository';
import { TokenService } from '@modules/auth/infrastructure/services/token.service';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import { LoginUseCase } from '@modules/auth/application/use-cases/login.use-case';
import { RefreshUseCase } from '@modules/auth/application/use-cases/refresh.use-case';
import { LogoutUseCase } from '@modules/auth/application/use-cases/logout.use-case';
import { GetMeUseCase } from '@modules/auth/application/use-cases/get-me.use-case';

export function createAuthContainer() {
  const prisma = getPrismaClient();
  const transactionManager = new PrismaTransactionManager(prisma);
  const userRepository = new PrismaUserRepository(prisma);
  const refreshTokenRepository = new PrismaRefreshTokenRepository(prisma);
  const sessionRepository = new PrismaSessionRepository(prisma);
  const tokenService = new TokenService();

  return {
    tokenService,
    register: new RegisterUseCase(
      transactionManager,
      userRepository,
      refreshTokenRepository,
      sessionRepository,
      tokenService,
    ),
    login: new LoginUseCase(
      transactionManager,
      userRepository,
      refreshTokenRepository,
      sessionRepository,
      tokenService,
    ),
    refresh: new RefreshUseCase(
      transactionManager,
      userRepository,
      refreshTokenRepository,
      sessionRepository,
      tokenService,
    ),
    logout: new LogoutUseCase(refreshTokenRepository, tokenService),
    getMe: new GetMeUseCase(userRepository),
  };
}

export type AuthContainer = ReturnType<typeof createAuthContainer>;
