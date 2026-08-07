import { refresh } from '@/actions/auth/actions';

type RefreshResult = Awaited<ReturnType<typeof refresh>>;

const SUCCESS_CACHE_TTL_MS = 15_000;

const inflightByToken = new Map<string, Promise<RefreshResult>>();
const successCacheByToken = new Map<
  string,
  { result: RefreshResult; expiresAt: number }
>();

const isSuccessfulRefresh = (result: RefreshResult): boolean =>
  Boolean(result?.result?.data?.tokens?.accessToken) && !result?.error?.message;

/**
 * Dedupes concurrent refresh calls and serves a short-lived success cache so a
 * late caller with the old refresh token does not hit the API again (rotation
 * race → revoked token).
 */
export function refreshAccessTokenDeduped(
  refreshToken: string,
): Promise<RefreshResult> {
  const cached = successCacheByToken.get(refreshToken);
  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.result);
  }

  if (cached) {
    successCacheByToken.delete(refreshToken);
  }

  const existing = inflightByToken.get(refreshToken);
  if (existing) {
    return existing;
  }

  const promise = refresh({ refreshToken })
    .then((result) => {
      if (isSuccessfulRefresh(result)) {
        successCacheByToken.set(refreshToken, {
          result,
          expiresAt: Date.now() + SUCCESS_CACHE_TTL_MS,
        });
      }
      return result;
    })
    .finally(() => {
      inflightByToken.delete(refreshToken);
    });

  inflightByToken.set(refreshToken, promise);
  return promise;
}
