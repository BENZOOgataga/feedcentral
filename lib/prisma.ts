import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient singleton instance
 * Prevents multiple instances in development (hot reload)
 * 
 * Note: Using standard Prisma Client with Prisma Accelerate (db.prisma.io)
 * which handles serverless connections automatically - no need for Neon adapter
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // For Vercel with Prisma Accelerate, use standard client
  // The connection to db.prisma.io is already optimized for serverless
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
