const PREFIX = '[AUTH]';

const COLORS = {
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  success: '\x1b[32m',
  action: '\x1b[35m',
  reset: '\x1b[0m',
};

export const authLog = {
  info: (message: unknown) =>
    console.info(`${COLORS.info}${PREFIX} ${message}${COLORS.reset}`),
  warn: (message: unknown) =>
    console.warn(`${COLORS.warn}${PREFIX} ${message}${COLORS.reset}`),
  error: (message: unknown) =>
    console.error(`${COLORS.error}${PREFIX} ${message}${COLORS.reset}`),
  success: (message: unknown) =>
    console.info(`${COLORS.success}${PREFIX} ✓ ${message}${COLORS.reset}`),
  action: (message: unknown) =>
    console.info(`${COLORS.action}${PREFIX} → ${message}${COLORS.reset}`),
};
