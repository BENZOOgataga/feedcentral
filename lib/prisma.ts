import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';
import { getDatabaseUrl } from './env';

/**
 * PrismaClient singleton instance
 * Prevents multiple instances in development (hot reload)
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Use Neon adapter for Vercel (serverless-friendly, no binary engines)
  if (process.env.VERCEL) {
    const connectionString = getDatabaseUrl();
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    
    return new PrismaClient({
      adapter: adapter as any,
      log: ['error'],
    });
  }
  
  // Use standard Prisma Client for local development
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
