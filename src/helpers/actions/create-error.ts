export const createError = (
  statusCode: number,
  message: string,
  path: string,
  method: string,
) => ({
  statusCode,
  message,
  timestamp: new Date().toISOString(),
  path,
  method,
  error: 'Not Found',
});
