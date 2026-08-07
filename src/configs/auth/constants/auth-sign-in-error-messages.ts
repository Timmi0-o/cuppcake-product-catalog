export const AUTH_SIGN_IN_ERROR_CODES = {
  '400': 'NO_CREDENTIALS',
  '401': 'INVALID_CREDENTIALS',
  '403': 'FORBIDDEN',
  '404': 'NOT_FOUND',
  '409': 'ALREADY_EXISTS',
  '500': 'SERVER_ERROR',
} as const;

export type IAuthSignInErrorCode =
  (typeof AUTH_SIGN_IN_ERROR_CODES)[keyof typeof AUTH_SIGN_IN_ERROR_CODES];

export const GET_AUTH_ERROR_CODE_BY_STATUS = (
  statusCode: number,
): IAuthSignInErrorCode => {
  const key = String(statusCode) as keyof typeof AUTH_SIGN_IN_ERROR_CODES;
  return AUTH_SIGN_IN_ERROR_CODES[key] ?? AUTH_SIGN_IN_ERROR_CODES['500'];
};
