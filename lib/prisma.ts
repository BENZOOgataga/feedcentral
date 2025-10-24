import { PrismaClient } from '@prisma/client';
import path from 'path';

/**
 * PrismaClient singleton instance
 * Prevents multiple instances in development (hot reload)
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Set Prisma query engine path for Vercel
if (process.env.VERCEL) {
  const queryEnginePath = path.join(
    process.cwd(),
    'node_modules',
    '.prisma',
    'client',
    'libquery_engine-rhel-openssl-3.0.x.so.node'
  );
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = queryEnginePath;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
