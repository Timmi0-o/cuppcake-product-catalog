import type { PrismaClient } from '@prisma/client';

export type PrismaTxClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;
