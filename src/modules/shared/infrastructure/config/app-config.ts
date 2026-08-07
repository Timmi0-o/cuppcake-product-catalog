function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export const appConfig = {
  get jwtAccessSecret() {
    return requireEnv('JWT_ACCESS_SECRET');
  },
  get jwtRefreshSecret() {
    return requireEnv('JWT_REFRESH_SECRET');
  },
  get jwtAccessTtl() {
    return process.env.JWT_ACCESS_TTL ?? '15m';
  },
  get jwtRefreshTtl() {
    return process.env.JWT_REFRESH_TTL ?? '7d';
  },
  get uploadDir() {
    return process.env.UPLOAD_DIR ?? 'public/uploads';
  },
  get uploadMaxFileSizeBytes() {
    return Number(process.env.UPLOAD_MAX_FILE_SIZE_BYTES ?? 10 * 1024 * 1024);
  },
};
