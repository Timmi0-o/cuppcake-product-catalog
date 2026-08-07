import { headers } from 'next/headers';

export const getRequestHeaders = async () => {
  const headersList = await headers();
  const host =
    headersList.get('host') || headersList.get('x-forwarded-host') || '';
  const protocol = headersList.get('x-forwarded-proto') || 'http';

  return {
    host,
    origin: headersList.get('origin') || `${protocol}://${host}`,
    'x-forwarded-host': host,
    'x-forwarded-proto': protocol,
  };
};
