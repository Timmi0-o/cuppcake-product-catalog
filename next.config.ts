import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@wrksz/themes'],
  images: {
    localPatterns: [
      {
        pathname: '/uploads/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
