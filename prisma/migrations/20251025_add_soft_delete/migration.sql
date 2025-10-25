-- Add soft delete support to articles table
-- This allows articles to be archived instead of permanently deleted
-- Bookmarked articles will remain accessible to users even after deletion

-- Add deletedAt column for soft delete timestamp
ALTER TABLE articles ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;

-- Add archivedData column to preserve article information
ALTER TABLE articles ADD COLUMN IF NOT EXISTS "archivedData" JSONB;

-- Create index on deletedAt for efficient filtering
CREATE INDEX IF NOT EXISTS "articles_deletedAt_idx" ON articles("deletedAt");
