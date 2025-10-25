const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.PRISMA_DATABASE_URL || 
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL || 
  'postgresql://postgres:postgres@localhost:5432/feedcentral';

async function applyMigration() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('✓ Connected to database');

    const migrationPath = path.join(process.cwd(), 'prisma/migrations/add_soft_delete.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    await client.query(migrationSQL);
    
    console.log('✅ Soft delete migration applied successfully!');
    console.log('Articles table now has:');
    console.log('  - deletedAt column (for soft delete timestamp)');
    console.log('  - archivedData column (preserves article info for bookmarks)');
    console.log('  - Index on deletedAt for efficient filtering');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

applyMigration().catch(console.error);
