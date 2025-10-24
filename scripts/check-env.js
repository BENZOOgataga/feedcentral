#!/usr/bin/env node
/**
 * Environment Validation Script
 * Run this to check if your environment is properly configured
 * 
 * Usage: npm run check-env
 */

// Load environment variables from .env file
require('dotenv').config({ path: '.env' });

console.log('\n🔍 FeedCentral Environment Validation\n');
console.log('='.repeat(60));

// Validation results
const errors = [];
const warnings = [];

// Detect environment
const isVercel = process.env.VERCEL === '1';
const nodeEnv = process.env.NODE_ENV || 'development';

// Check database URL
const hasDatabase = 
  process.env.PRISMA_DATABASE_URL || 
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL;

if (!hasDatabase) {
  if (isVercel) {
    errors.push(
      '❌ Missing database connection string',
      '',
      'Expected one of:',
      '  - PRISMA_DATABASE_URL (Vercel Postgres with pooling)',
      '  - POSTGRES_URL (Vercel Postgres direct connection)',
      '  - DATABASE_URL (custom connection string)',
      '',
      'Steps to fix:',
      '  1. Go to Vercel dashboard',
      '  2. Navigate to Storage tab',
      '  3. Create a Postgres database',
      '  4. Connection strings will be auto-injected',
      ''
    );
  } else {
    errors.push(
      '❌ Missing DATABASE_URL',
      '',
      'Add to your .env file:',
      '  DATABASE_URL="postgresql://user:password@localhost:5432/feedcentral"',
      '',
      'Steps to fix:',
      '  1. Copy .env.example to .env',
      '  2. Update DATABASE_URL with your PostgreSQL credentials',
      '  3. Ensure PostgreSQL is running on your machine',
      ''
    );
  }
}

// Check JWT secret
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  errors.push(
    '❌ Missing JWT_SECRET',
    '',
    'Add to your .env file:',
    '  JWT_SECRET="your-secret-key-min-32-chars"',
    '',
    'Generate a secure secret:',
    '  openssl rand -base64 32',
    '',
    'Or on Windows PowerShell:',
    '  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"',
    ''
  );
} else if (jwtSecret.length < 32) {
  errors.push(
    '❌ JWT_SECRET is too short',
    '',
    `Current length: ${jwtSecret.length} characters`,
    'Required: minimum 32 characters',
    '',
    'Generate a new secret:',
    '  openssl rand -base64 32',
    ''
  );
}

// Check admin credentials (warnings only)
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  warnings.push(
    '⚠️  Using default admin credentials',
    '',
    'Default credentials:',
    '  Email: admin@feedcentral.local',
    '  Password: admin123',
    '',
    'To customize (recommended for production):',
    '  ADMIN_USERNAME="your-admin@example.com"',
    '  ADMIN_PASSWORD="your-secure-password"',
    ''
  );
}

// Gather environment info
let siteUrl = 'http://localhost:3000';
if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  siteUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
} else if (process.env.VERCEL_URL) {
  siteUrl = `https://${process.env.VERCEL_URL}`;
} else if (process.env.NEXT_PUBLIC_SITE_URL) {
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
}

let databaseType = 'None';
if (process.env.PRISMA_DATABASE_URL) {
  databaseType = 'Vercel Postgres (Pooled)';
} else if (process.env.POSTGRES_URL) {
  databaseType = 'Vercel Postgres (Direct)';
} else if (process.env.DATABASE_URL) {
  databaseType = 'PostgreSQL';
}

const adminUsername = process.env.ADMIN_USERNAME || 'admin@feedcentral.local (default)';

// Display environment information
console.log('\n📊 Environment Information:\n');
console.log(`  NODE_ENV:        ${nodeEnv}`);
console.log(`  Platform:        ${isVercel ? 'Vercel' : 'Local'}`);
console.log(`  Site URL:        ${siteUrl}`);
console.log(`  Database:        ${databaseType}`);
console.log(`  JWT Secret:      ${jwtSecret ? `✓ Set (${jwtSecret.length} chars)` : '✗ Missing'}`);
console.log(`  Admin User:      ${adminUsername}`);

// Display warnings
if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:\n');
  warnings.forEach(line => console.log(`  ${line}`));
}

// Display errors
if (errors.length > 0) {
  console.log('\n❌ Errors:\n');
  errors.forEach(line => console.log(`  ${line}`));
  console.log('='.repeat(60));
  console.log('\n❌ Environment validation failed!');
  console.log('\nPlease fix the errors above and run this script again.\n');
  process.exit(1);
}

// Success!
console.log('\n='.repeat(60));
console.log('\n✅ Environment validation successful!');
console.log('\nYou can now run:');
console.log('  npm run dev      (start development server)');
console.log('  npm run setup    (initialize database)');
console.log('  npm run build    (build for production)');
console.log('\n');

process.exit(0);
