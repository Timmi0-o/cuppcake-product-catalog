type ClientCookieOptions = {
  maxAge?: number;
  secure?: boolean;
};

export const formatClientCookie = (
  key: string,
  value: string,
  options: ClientCookieOptions = {},
): string => {
  const maxAge = options.maxAge ?? 60 * 60 * 24 * 365;
  const secure =
    options.secure ??
    (typeof window !== 'undefined' && window.location.protocol === 'https:');

  const parts = [
    `${key}=${encodeURIComponent(value)}`,
    'path=/',
    `max-age=${maxAge}`,
    'samesite=lax',
  ];

  if (secure) {
    parts.push('secure');
  }

  return parts.join('; ');
};
