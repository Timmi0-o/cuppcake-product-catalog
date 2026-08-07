import createMiddleware from 'next-intl/middleware';
import { routing } from '@/helpers/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|uploads|.*\\..*).*)',
  ],
};
