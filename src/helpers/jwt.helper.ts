type IsJwtExpiredReturn = boolean;

export const isJWTExpired = (
  expirationTimestampMiliSeconds: number | null,
  options?: { marginMiliSeconds?: number },
): IsJwtExpiredReturn => {
  if (expirationTimestampMiliSeconds === null) {
    return true;
  }

  const margin = options?.marginMiliSeconds ?? 0;
  return expirationTimestampMiliSeconds <= Date.now() + margin;
};

export function parseJwt(token: null | string): {
  exp: number;
  sub: string;
  email?: string;
  iat: number;
} | null {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }
    return JSON.parse(atob(payload)) as {
      exp: number;
      sub: string;
      email?: string;
      iat: number;
    };
  } catch {
    return null;
  }
}
