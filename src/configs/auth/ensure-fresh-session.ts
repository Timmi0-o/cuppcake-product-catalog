import { isJWTExpired } from '@/helpers/jwt.helper';
import type { Session } from 'next-auth';
import { headers } from 'next/headers';

/** Keep in sync with auth.ts ACCESS_TOKEN_REFRESH_MARGIN_MS. */
export const ACCESS_TOKEN_REFRESH_MARGIN_MS = 60_000;

type EnsureFreshSessionOptions = {
  /** Force Auth.js jwt rotation even if access still looks fresh (post-401). */
  force?: boolean;
};

const inflightByRefreshToken = new Map<string, Promise<Session | null>>();

/** Cookie writes are allowed only in Server Action / Route Handler context. */
const canWriteSessionCookies = async (): Promise<boolean> => {
  const headerStore = await headers();
  return Boolean(headerStore.has('next-action'));
};

/**
 * Single server-side gateway for reading a session with a usable access token.
 * Rotates via `unstable_update` only when Auth.js can persist Set-Cookie.
 *
 * Dynamic import of auth avoids: auth → refresh action → fetcher → ensureFreshSession → auth.
 */
export const ensureFreshSession = async (
  options: EnsureFreshSessionOptions = {},
): Promise<Session | null> => {
  const { auth, unstable_update } = await import('@/configs/auth/auth');
  const session = await auth();

  if (!session?.accessToken) {
    return session;
  }

  const isAccessExpired = isJWTExpired(session.exp, {
    marginMiliSeconds: ACCESS_TOKEN_REFRESH_MARGIN_MS,
  });

  if (!options.force && !isAccessExpired) {
    return session;
  }

  if (!(await canWriteSessionCookies())) {
    return session;
  }

  const dedupeKey = session.refreshToken ?? session.accessToken;
  const existing = inflightByRefreshToken.get(dedupeKey);
  if (existing) {
    return existing;
  }

  const updatePayload = (
    options.force ? { isForceRefresh: true } : {}
  ) as never;

  const promise = unstable_update(updatePayload).finally(() => {
    inflightByRefreshToken.delete(dedupeKey);
  });

  inflightByRefreshToken.set(dedupeKey, promise);
  return promise;
};
