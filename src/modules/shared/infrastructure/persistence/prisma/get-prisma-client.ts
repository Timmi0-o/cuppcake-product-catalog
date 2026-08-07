import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Prisma `?schema=` is not applied by driver adapters — force Postgres search_path. */
function withSchemaSearchPath(connectionString: string): string {
  const url = new URL(connectionString);
  const schema = url.searchParams.get('schema');
  if (!schema || schema === 'public') {
    return connectionString;
  }

  const existingOptions = url.searchParams.get('options') ?? '';
  if (existingOptions.includes('search_path')) {
    return connectionString;
  }

  const searchPathOption = `-csearch_path=${schema}`;
  url.searchParams.set(
    'options',
    existingOptions
      ? `${existingOptions} ${searchPathOption}`
      : searchPathOption,
  );
  return url.toString();
}

export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required for Prisma adapter');
  }

  const adapter = new PrismaPg({
    connectionString: withSchemaSearchPath(connectionString),
  });
  const prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}
