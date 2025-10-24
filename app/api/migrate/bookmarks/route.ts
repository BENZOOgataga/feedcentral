import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/migrate/bookmarks
 * Creates the bookmarks table in the database
 * This is a one-time migration endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Check if bookmarks table already exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'bookmarks'
      );
    `;

    if ((tableExists as any)[0].exists) {
      return NextResponse.json({
        success: true,
        message: 'Bookmarks table already exists',
        alreadyExists: true,
      });
    }

    // Create bookmarks table
    await prisma.$executeRaw`
      CREATE TABLE "bookmarks" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "articleId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
      );
    `;

    // Create indexes
    await prisma.$executeRaw`
      CREATE INDEX "bookmarks_userId_idx" ON "bookmarks"("userId");
    `;

    await prisma.$executeRaw`
      CREATE INDEX "bookmarks_articleId_idx" ON "bookmarks"("articleId");
    `;

    await prisma.$executeRaw`
      CREATE INDEX "bookmarks_createdAt_idx" ON "bookmarks"("createdAt" DESC);
    `;

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX "bookmarks_userId_articleId_key" ON "bookmarks"("userId", "articleId");
    `;

    // Add foreign keys
    await prisma.$executeRaw`
      ALTER TABLE "bookmarks" 
      ADD CONSTRAINT "bookmarks_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

    await prisma.$executeRaw`
      ALTER TABLE "bookmarks" 
      ADD CONSTRAINT "bookmarks_articleId_fkey" 
      FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

    return NextResponse.json({
      success: true,
      message: 'Bookmarks table created successfully',
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Migration failed',
        message: error.message,
        details: error,
      },
      { status: 500 }
    );
  }
}
