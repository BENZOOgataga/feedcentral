// Check Production Database Schema
const { Client } = require('pg');

const checkDatabase = async () => {
  const client = new Client({
    connectionString: 'postgresql://feedcentral:i27Y%40fj2Q0z679PbVAQ4e0Y0eZIs7%40Buy%24%5Eo733fxv%40M%5E%26Mpdl%24m2vbP%403KeQ*Gu@94.239.97.139:6432/feedcentral'
  });

  try {
    await client.connect();
    console.log('✅ Connected to production database via PgBouncer\n');

    // Check tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📋 Tables in database:');
    console.log('='.repeat(50));
    tablesResult.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.table_name}`);
    });
    console.log('='.repeat(50));
    console.log(`Total: ${tablesResult.rows.length} tables\n`);

    // Check Prisma migrations
    const migrationsResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '_prisma_migrations'
      );
    `);
    
    if (migrationsResult.rows[0].exists) {
      const migrationCount = await client.query(`
        SELECT COUNT(*) as count FROM "_prisma_migrations";
      `);
      console.log(`✅ Prisma migrations table exists`);
      console.log(`   Applied migrations: ${migrationCount.rows[0].count}\n`);
      
      // Show last migration
      const lastMigration = await client.query(`
        SELECT migration_name, finished_at 
        FROM "_prisma_migrations" 
        ORDER BY finished_at DESC 
        LIMIT 1;
      `);
      if (lastMigration.rows.length > 0) {
        console.log(`📅 Last migration: ${lastMigration.rows[0].migration_name}`);
        console.log(`   Applied at: ${lastMigration.rows[0].finished_at}\n`);
      }
    } else {
      console.log('⚠️  No Prisma migrations table found!\n');
    }

    // Check for expected core tables
    const expectedTables = [
      'User',
      'Source',
      'Article',
      'Bookmark',
      'Session',
      '_prisma_migrations'
    ];

    console.log('🔍 Core table validation:');
    console.log('='.repeat(50));
    const tableNames = tablesResult.rows.map(r => r.table_name);
    for (const table of expectedTables) {
      const exists = tableNames.includes(table);
      console.log(`${exists ? '✅' : '❌'} ${table}`);
    }
    console.log('='.repeat(50) + '\n');

    // Check user count
    if (tableNames.includes('User')) {
      const userCount = await client.query('SELECT COUNT(*) as count FROM "User";');
      console.log(`👥 Users in database: ${userCount.rows[0].count}`);
    }

    // Check source count
    if (tableNames.includes('Source')) {
      const sourceCount = await client.query('SELECT COUNT(*) as count FROM "Source";');
      console.log(`📰 Sources in database: ${sourceCount.rows[0].count}`);
    }

    // Check article count
    if (tableNames.includes('Article')) {
      const articleCount = await client.query('SELECT COUNT(*) as count FROM "Article";');
      console.log(`📄 Articles in database: ${articleCount.rows[0].count}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
};

checkDatabase();
