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
  console.log('🔧 Creating Prisma client...');
  console.log('VERCEL env var:', process.env.VERCEL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Check if we're in Vercel (use NODE_ENV as fallback check)
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true' || !!process.env.VERCEL;
  
  // Use Neon adapter for Vercel (serverless-friendly, no binary engines)
  if (isVercel) {
    console.log('🌐 Detected Vercel environment');
    
    // Get connection string - try all possible env vars
    const connectionString = 
      process.env.POSTGRES_URL || 
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL;
    
    console.log('Database env vars check:');
    console.log('- POSTGRES_URL:', !!process.env.POSTGRES_URL, process.env.POSTGRES_URL?.substring(0, 20));
    console.log('- DATABASE_URL:', !!process.env.DATABASE_URL, process.env.DATABASE_URL?.substring(0, 20));
    console.log('- POSTGRES_PRISMA_URL:', !!process.env.POSTGRES_PRISMA_URL);
    
    if (!connectionString) {
      const envKeys = Object.keys(process.env).filter(k => 
        k.includes('POSTGRES') || k.includes('DATABASE') || k.includes('PRISMA')
      );
      console.error('❌ No database connection string found!');
      console.error('Available env vars:', envKeys);
      throw new Error(`No database connection string found. Available vars: ${envKeys.join(', ')}`);
    }
    
    console.log('✅ Using database connection, length:', connectionString.length);
    
    // Configure for serverless
    neonConfig.fetchConnectionCache = true;
    
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    
    return new PrismaClient({
      adapter: adapter as any,
      log: ['error', 'warn'],
    });
  }
  
  console.log('💻 Using local Prisma client');
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
