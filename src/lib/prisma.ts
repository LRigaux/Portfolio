import { PrismaClient } from '@prisma/client';

// Éviter de créer plusieurs instances de Prisma Client en développement
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-multiple-instances-in-development

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
} 