/** Base path of the internal product-catalog HTTP API. */
export const API_URL =
  process.env.APP_URL != null && process.env.APP_URL.length > 0
    ? `${process.env.APP_URL.replace(/\/$/, '')}/api/v1`
    : '/api/v1';
