export function getRequestMeta(request: Request): {
  ipAddress: string | null;
  userAgent: string | null;
} {
  const forwarded = request.headers.get('x-forwarded-for');
  const ipAddress =
    forwarded?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    null;
  const userAgent = request.headers.get('user-agent');
  return { ipAddress, userAgent };
}
