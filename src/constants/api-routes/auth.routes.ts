import { API_URL } from './api-url.constant';

export const AUTH_ROUTES = {
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  refresh: `${API_URL}/auth/refresh`,
  logout: `${API_URL}/auth/logout`,
  me: `${API_URL}/auth/me`,
} as const;
