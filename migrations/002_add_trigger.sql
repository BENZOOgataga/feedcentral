-- Create trigger function for search vector
CREATE OR REPLACE FUNCTION articles_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.source_name, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS articles_search_vector_trigger ON articles;
CREATE TRIGGER articles_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, description, source_name ON articles
FOR EACH ROW
EXECUTE FUNCTION articles_search_vector_update();
