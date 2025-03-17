import { PrismaClient } from '@prisma/client';

// Vérifier que nous ne sommes pas dans un environnement navigateur
const isServer = typeof window === 'undefined';

// Éviter les instances multiples en développement
const globalForPrisma = isServer ? (global as unknown as { prisma: PrismaClient }) : undefined;

// Ne créer PrismaClient que côté serveur
export const prisma = isServer 
  ? globalForPrisma?.prisma || new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  : undefined;

if (isServer && process.env.NODE_ENV !== 'production') {
  globalForPrisma!.prisma = prisma;
} 