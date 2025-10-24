import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';

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
    // Vercel Postgres provides POSTGRES_PRISMA_URL for pooled connections
    // Use POSTGRES_PRISMA_URL (pooled) for better serverless performance
    const connectionString = 
      process.env.POSTGRES_PRISMA_URL || 
      process.env.POSTGRES_URL || 
      process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('POSTGRES') || k.includes('DATABASE')));
      throw new Error('No database connection string found. Set POSTGRES_PRISMA_URL, POSTGRES_URL, or DATABASE_URL.');
    }
    
    console.log('Using connection string length:', connectionString.length);
    
    // Configure for serverless
    neonConfig.fetchConnectionCache = true;
    
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    
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
