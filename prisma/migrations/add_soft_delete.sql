-- Add soft delete support to articles table
-- This allows articles to be archived instead of permanently deleted
-- Bookmarked articles will remain accessible to users even after deletion

-- Add deletedAt column for soft delete timestamp
ALTER TABLE articles ADD COLUMN "deletedAt" TIMESTAMP;

-- Add archivedData column to preserve article information
-- This stores the article title, description, and other metadata
-- so bookmarked articles remain viewable even after soft deletion
ALTER TABLE articles ADD COLUMN "archivedData" JSONB;

-- Create index on deletedAt for efficient filtering
CREATE INDEX "articles_deletedAt_idx" ON articles("deletedAt");

-- Example of how to use soft delete:
-- UPDATE articles SET "deletedAt" = NOW(), "archivedData" = jsonb_build_object(
--   'title', title,
--   'description', description,
--   'url', url,
--   'imageUrl', "imageUrl",
--   'author', author,
--   'publishedAt', "publishedAt",
--   'sourceName', (SELECT name FROM sources WHERE id = "sourceId"),
--   'categoryName', (SELECT name FROM categories WHERE id = "categoryId")
-- ) WHERE "publishedAt" < NOW() - INTERVAL '1 year' AND "deletedAt" IS NULL;
