import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    exp: number;
    user: {
      id: string;
      email: string;
    } & Omit<DefaultSession['user'], 'email'>;
  }

  interface User {
    email: string;
    accessToken: string;
    refreshToken: string;
    exp: number;
    userId: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: {
      email: string;
      userId: string;
    };
  }
}
