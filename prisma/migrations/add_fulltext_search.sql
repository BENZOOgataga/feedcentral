-- Add full-text search support to articles table
-- This migration adds a tsvector column and GIN index for fast full-text search

-- Add tsvector column for full-text search
ALTER TABLE articles ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create a function to update the search vector
CREATE OR REPLACE FUNCTION articles_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.author, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search_vector on INSERT/UPDATE
DROP TRIGGER IF EXISTS articles_search_vector_trigger ON articles;
CREATE TRIGGER articles_search_vector_trigger
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION articles_search_vector_update();

-- Backfill existing articles
UPDATE articles
SET search_vector =
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(content, '')), 'C') ||
  setweight(to_tsvector('english', coalesce(author, '')), 'D');

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS articles_search_vector_idx ON articles USING GIN(search_vector);

-- Index already exists from schema (@@index([publishedAt(sort: Desc)]))
-- CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles("publishedAt" DESC);
