import { createHash } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { appConfig } from '@shared/infrastructure/config';

function parseTtlToSeconds(ttl: string): number {
  const match = /^(\d+)([smhd])$/.exec(ttl);
  if (!match) {
    throw new Error(`Invalid TTL format: ${ttl}`);
  }
  const value = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 60 * 60 * 24;
    default:
      throw new Error(`Invalid TTL unit: ${unit}`);
  }
}

export type AccessTokenPayload = {
  userId: string;
  email: string;
};

export class TokenService {
  private accessSecret() {
    return new TextEncoder().encode(appConfig.jwtAccessSecret);
  }

  private refreshSecret() {
    return new TextEncoder().encode(appConfig.jwtRefreshSecret);
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  getRefreshTokenExpiresAt(): Date {
    const seconds = parseTtlToSeconds(appConfig.jwtRefreshTtl);
    return new Date(Date.now() + seconds * 1000);
  }

  async issueTokenPair(payload: AccessTokenPayload): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = await new SignJWT({
      email: payload.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(payload.userId)
      .setIssuedAt()
      .setExpirationTime(appConfig.jwtAccessTtl)
      .sign(this.accessSecret());

    const refreshToken = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(payload.userId)
      .setIssuedAt()
      .setExpirationTime(appConfig.jwtRefreshTtl)
      .sign(this.refreshSecret());

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const { payload } = await jwtVerify(token, this.accessSecret());
    const userId = payload.sub;
    const email = payload.email;
    if (!userId || typeof email !== 'string') {
      throw new Error('Invalid access token payload');
    }
    return { userId, email };
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string }> {
    const { payload } = await jwtVerify(token, this.refreshSecret());
    if (!payload.sub) {
      throw new Error('Invalid refresh token payload');
    }
    return { userId: payload.sub };
  }
}
