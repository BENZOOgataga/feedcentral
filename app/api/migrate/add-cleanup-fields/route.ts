import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCronApiKey } from '@/lib/env';

/**
 * One-time migration endpoint to add deletedAt and archivedData columns
 * DELETE THIS FILE AFTER RUNNING!
 * 
 * Usage: POST /api/migrate/add-cleanup-fields
 * Header: Authorization: Bearer YOUR_CRON_API_KEY
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const cronApiKey = getCronApiKey();
    const isDevelopment = process.env.NODE_ENV === 'development';

    const isAuthorized = cronApiKey && authHeader === `Bearer ${cronApiKey}`;

    if (!isDevelopment && !isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[MIGRATION] Running add-cleanup-fields migration...');

    // Execute raw SQL to add columns if they don't exist
    await prisma.$executeRaw`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "archivedData" JSONB;
    `;

    // Create index on deletedAt if it doesn't exist
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "articles_deletedAt_idx" ON articles("deletedAt");
    `;

    console.log('[MIGRATION] Migration completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      note: 'DELETE THIS API ROUTE NOW - /api/migrate/add-cleanup-fields',
    });
  } catch (error: any) {
    console.error('[MIGRATION] Migration failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
