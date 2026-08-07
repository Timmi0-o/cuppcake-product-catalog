import { cookies } from 'next/headers';

type SessionCookieOptions = {
  httpOnly: true;
  sameSite: 'lax';
  path: '/';
  secure: boolean;
  maxAge: number;
  expires: Date;
};

const buildExpiredCookieOptions = (
  isSecureCookies: boolean,
): SessionCookieOptions => ({
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure: isSecureCookies,
  maxAge: 0,
  expires: new Date(0),
});

/**
 * Clears Auth.js session cookie chunks. Only works in Server Actions /
 * contexts where `cookies().set` is allowed.
 */
export const clearSessionCookie = async (): Promise<boolean> => {
  const isSecureCookies = process.env.NODE_ENV === 'production';
  const options = buildExpiredCookieOptions(isSecureCookies);

  try {
    const cookieStore = await cookies();

    for (const cookie of cookieStore.getAll()) {
      const isSessionCookie =
        cookie.name === 'authjs.session-token' ||
        cookie.name === '__Secure-authjs.session-token' ||
        cookie.name.startsWith('authjs.session-token.') ||
        cookie.name.startsWith('__Secure-authjs.session-token.');

      if (isSessionCookie) {
        cookieStore.set(cookie.name, '', options);
      }
    }

    return true;
  } catch {
    return false;
  }
};
