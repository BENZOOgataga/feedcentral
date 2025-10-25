// Script to apply full-text search migration
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/feedcentral',
  });

  try {
    console.log('📦 Connecting to database...');
    await client.connect();

    console.log('📦 Reading migration file...');
    const migrationPath = path.join(__dirname, '../prisma/migrations/add_fulltext_search.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('🚀 Applying full-text search migration...');
    
    // Execute the entire SQL file
    await client.query(migrationSQL);

    console.log('✅ Full-text search migration applied successfully!');
    console.log('');
    console.log('The articles table now has:');
    console.log('  - search_vector column (tsvector)');
    console.log('  - GIN index for fast full-text search');
    console.log('  - Automatic trigger to update search vectors');
    
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
