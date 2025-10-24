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
    // Get connection string - try all possible env vars
    const connectionString = 
      process.env.POSTGRES_URL || 
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL;
    
    if (!connectionString) {
      const envKeys = Object.keys(process.env).filter(k => 
        k.includes('POSTGRES') || k.includes('DATABASE') || k.includes('PRISMA')
      );
      console.error('❌ No database connection string found!');
      console.error('Available env vars:', envKeys);
      throw new Error(`No database connection string found. Available vars: ${envKeys.join(', ')}`);
    }
    
    console.log('✅ Using database connection');
    console.log('Connection string length:', connectionString.length);
    console.log('Connection starts with:', connectionString.substring(0, 20));
    
    // Configure for serverless
    neonConfig.fetchConnectionCache = true;
    
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    
    return new PrismaClient({
      adapter: adapter as any,
      log: ['error', 'warn'],
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
