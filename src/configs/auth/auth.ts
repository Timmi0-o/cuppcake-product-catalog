import { login } from '@/actions/auth/actions';
import { authLog } from '@/configs/auth/auth-logger';
import {
  AUTH_SIGN_IN_ERROR_CODES,
  GET_AUTH_ERROR_CODE_BY_STATUS,
} from '@/configs/auth/constants/auth-sign-in-error-messages';
import { AuthSignInError } from '@/configs/auth/errors/auth-sign-in.error';
import { isJWTExpired, parseJwt } from '@/helpers/jwt.helper';
import type { NextAuthConfig, Session, User } from 'next-auth';
import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { clearSessionCookie } from './persist-session-cookie';
import { refreshAccessTokenDeduped } from './refresh-token-deduped';

/** Refresh slightly before access expires; must stay well below access TTL. */
const ACCESS_TOKEN_REFRESH_MARGIN_MS = 60_000;

const MILLISEC = 1000;

interface IAuthPayload {
  tokens: { accessToken: string; refreshToken: string };
  user: {
    email: string;
    id: string;
  };
}

const buildRefreshedToken = (
  token: JWT,
  authPayload: IAuthPayload,
): JWT | null => {
  const decoded = parseJwt(authPayload.tokens.accessToken);

  if (!decoded?.exp) {
    return null;
  }

  return {
    ...token,
    accessToken: authPayload.tokens.accessToken,
    refreshToken: authPayload.tokens.refreshToken,
    accessTokenExpires: decoded.exp * MILLISEC,
    user: {
      email: authPayload.user.email,
      userId: authPayload.user.id,
    },
  };
};

const config = {
  session: { strategy: 'jwt' as const },
  trustHost: true,
  providers: [
    Credentials({
      id: 'baseCredentials',
      name: 'baseCredentials',
      credentials: {
        email: { label: 'Email', type: 'text', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      authorize: async (credentials): Promise<User | null> => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new AuthSignInError(AUTH_SIGN_IN_ERROR_CODES['400']);
          }

          const loginData = await login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (loginData?.error?.message) {
            throw new AuthSignInError(
              GET_AUTH_ERROR_CODE_BY_STATUS(loginData.error.statusCode),
            );
          }

          const authPayload = loginData?.result?.data;

          if (!authPayload?.tokens.accessToken) {
            throw new AuthSignInError(AUTH_SIGN_IN_ERROR_CODES['500']);
          }

          const tokenPayload = parseJwt(authPayload.tokens.accessToken);

          if (!tokenPayload?.exp) {
            throw new AuthSignInError(AUTH_SIGN_IN_ERROR_CODES['500']);
          }

          authLog.success(`Login: ${credentials.email}`);

          return {
            email: authPayload.user.email,
            accessToken: authPayload.tokens.accessToken,
            refreshToken: authPayload.tokens.refreshToken,
            exp: tokenPayload.exp * MILLISEC,
            userId: authPayload.user.id,
          };
        } catch (error) {
          authLog.error(error);

          if (error instanceof AuthSignInError) {
            throw error;
          }

          throw new AuthSignInError(AUTH_SIGN_IN_ERROR_CODES['500']);
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  events: {
    signOut: (message) => {
      const token = 'token' in message ? message.token : null;
      const email =
        (token as { user?: { email?: string }; email?: string } | null)?.user
          ?.email ??
        (token as { email?: string } | null)?.email ??
        'unknown';

      authLog.success(`Logout: ${email}`);
    },
  },
  callbacks: {
    authorized: () => true,
    jwt: async ({ token, user, trigger, session }): Promise<JWT | null> => {
      if (user?.accessToken) {
        const decoded = parseJwt(user.accessToken);

        if (!decoded?.exp) {
          return null;
        }

        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: decoded.exp * MILLISEC,
          user: {
            email: user.email,
            userId: user.userId,
          },
        };
      }

      let isForceRefresh = false;

      if (trigger === 'update' && session && typeof session === 'object') {
        const patch = session as { isForceRefresh?: boolean };
        isForceRefresh = patch.isForceRefresh === true;
      }

      const isTokenExpired = isJWTExpired(token.accessTokenExpires as number, {
        marginMiliSeconds: ACCESS_TOKEN_REFRESH_MARGIN_MS,
      });

      if (!isForceRefresh && !isTokenExpired) {
        return token;
      }

      if (!token.refreshToken) {
        return null;
      }

      /**
       * Rotate refresh ONLY when Auth.js can write the new session cookie:
       * `trigger === 'update'` → `unstable_update()` / `update()` → cookies().set
       *
       * Plain `auth()` from RSC must NOT rotate: Auth.js discards Set-Cookie
       * there, which burns the refresh token on the API while the browser
       * keeps the old JWT cookie.
       */
      const canRotate = trigger === 'update';

      if (!canRotate) {
        authLog.warn('Access expired; skip refresh until unstable_update');
        return token;
      }

      authLog.warn(
        isForceRefresh
          ? 'Forced session refresh'
          : 'Token expired, attempting refresh',
      );

      try {
        authLog.action('START REFRESH TOKEN FN');

        const authPayload = await refreshAccessTokenDeduped(
          token.refreshToken as string,
        );

        if (authPayload?.error?.message) {
          authLog.warn(`Refresh failed: ${authPayload.error.message}`);
          await clearSessionCookie();
          return null;
        }

        const tokens = authPayload?.result?.data;
        if (!tokens?.tokens.accessToken) {
          authLog.warn('Refresh failed: empty token payload');
          await clearSessionCookie();
          return null;
        }

        const refreshedToken = buildRefreshedToken(token, tokens);

        if (!refreshedToken) {
          await clearSessionCookie();
          return null;
        }

        authLog.success(
          `Token refreshed successfully ${refreshedToken?.refreshToken?.slice(-10)}`,
        );
        return refreshedToken;
      } catch (error) {
        authLog.error(error);
        await clearSessionCookie();
        return null;
      } finally {
        authLog.action('FINISH REFRESH TOKEN FN');
      }
    },
    session: ({ session, token }): Session => {
      const tokenUser = token.user;

      return {
        ...session,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        exp: token.accessTokenExpires as number,
        user: {
          ...session.user,
          id: tokenUser?.userId ?? '',
          email: tokenUser?.email ?? session.user?.email ?? '',
        },
      };
    },
  },
  debug: false,
} satisfies NextAuthConfig;

const nextAuth = NextAuth(config);

export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const auth = nextAuth.auth;
export const unstable_update = nextAuth.unstable_update;
