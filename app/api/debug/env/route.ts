import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to check environment variables
 * REMOVE THIS IN PRODUCTION!
 */
export async function GET() {
  const envVars = {
    VERCEL: process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV,
    hasDatabase: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
    },
    urlLengths: {
      DATABASE_URL: process.env.DATABASE_URL?.length || 0,
      POSTGRES_URL: process.env.POSTGRES_URL?.length || 0,
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL?.length || 0,
    }
  };

  return NextResponse.json(envVars);
}
