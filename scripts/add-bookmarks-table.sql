-- Migration: Add Bookmarks Table
-- Date: 2024-10-24
-- Description: Adds bookmarks table for user-linked article bookmarks

-- CreateTable
CREATE TABLE IF NOT EXISTS "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bookmarks_userId_idx" ON "bookmarks"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bookmarks_articleId_idx" ON "bookmarks"("articleId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bookmarks_createdAt_idx" ON "bookmarks"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "bookmarks_userId_articleId_key" ON "bookmarks"("userId", "articleId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'bookmarks_userId_fkey'
    ) THEN
        ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'bookmarks_articleId_fkey'
    ) THEN
        ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_articleId_fkey" 
        FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
