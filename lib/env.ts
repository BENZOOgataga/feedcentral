/**
 * Environment Variable Configuration
 * Handles both local development and production (Vercel) environments
 * 
 * LOCAL DEVELOPMENT:
 * - Uses .env file with DATABASE_URL
 * - Requires manual configuration
 * 
 * PRODUCTION (Vercel):
 * - Uses environment variables set in Vercel dashboard
 * - Vercel automatically provides POSTGRES_URL, POSTGRES_PRISMA_URL, etc.
 * - No .env file needed
 */

/**
 * Get database URL with fallback priority:
 * 1. PRISMA_DATABASE_URL (Vercel Postgres with connection pooling)
 * 2. POSTGRES_URL (Vercel Postgres direct connection)
 * 3. DATABASE_URL (local development or custom setup)
 */
export function getDatabaseUrl(): string {
  const isVercel = process.env.VERCEL === '1';
  
  // Try Vercel Postgres pooled connection first (optimized for serverless)
  if (process.env.PRISMA_DATABASE_URL) {
    return process.env.PRISMA_DATABASE_URL;
  }
  
  // Try Vercel Postgres direct connection
  if (process.env.POSTGRES_URL) {
    return process.env.POSTGRES_URL;
  }
  
  // Try standard DATABASE_URL (local development)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Provide helpful error message based on environment
  if (isVercel) {
    throw new Error(
      'Missing database connection string in Vercel environment.\n\n' +
      'Expected one of:\n' +
      '  - PRISMA_DATABASE_URL (Vercel Postgres with pooling)\n' +
      '  - POSTGRES_URL (Vercel Postgres direct connection)\n' +
      '  - DATABASE_URL (custom connection string)\n\n' +
      'Steps to fix:\n' +
      '  1. Go to Vercel dashboard → Storage tab\n' +
      '  2. Create a Postgres database\n' +
      '  3. Connection strings will be auto-injected into your environment\n\n' +
      'See: https://vercel.com/docs/storage/vercel-postgres'
    );
  } else {
    throw new Error(
      'Missing DATABASE_URL in local environment.\n\n' +
      'Add to your .env file:\n' +
      '  DATABASE_URL="postgresql://user:password@localhost:5432/feedcentral"\n\n' +
      'Steps to fix:\n' +
      '  1. Copy .env.example to .env\n' +
      '  2. Update DATABASE_URL with your PostgreSQL credentials\n' +
      '  3. Ensure PostgreSQL is running locally\n\n' +
      'See: docs/ENVIRONMENT_SETUP.md for detailed instructions'
    );
  }
}

/**
 * Get JWT secret
 * Required for authentication
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    const env = process.env.NODE_ENV || 'development';
    throw new Error(
      `JWT_SECRET not configured for ${env} environment.\n` +
      `Generate one with: openssl rand -base64 32\n` +
      `For local development: Add to .env file\n` +
      `For production (Vercel): Set in Vercel dashboard environment variables`
    );
  }

  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters for security');
  }

  return secret;
}

/**
 * Get CORS origin
 */
export function getCorsOrigin(): string {
  return process.env.CORS_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || '*';
}

/**
 * Get cron API key for authenticated cron jobs
 */
export function getCronApiKey(): string | undefined {
  return process.env.CRON_API_KEY;
}

/**
 * Get admin credentials for database seeding
 * Supports both plain password (hashed during seed) and pre-hashed password
 * Priority: ADMIN_PASSWORD_HASH > ADMIN_PASSWORD
 */
export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME || 'admin@feedcentral.local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  
  return {
    username,
    password,
    passwordHash, // If set, use this instead of hashing password
  };
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running on Vercel
 */
export function isVercel(): boolean {
  return process.env.VERCEL === '1';
}

/**
 * Get public site URL
 * Automatically detects Vercel deployment URL
 */
export function getSiteUrl(): string {
  // 1. Use explicit NEXT_PUBLIC_SITE_URL if set
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 2. Use Vercel URL if deployed on Vercel
  if (isVercel()) {
    // Use production URL if available, otherwise deployment URL
    const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
    if (vercelUrl) {
      return `https://${vercelUrl}`;
    }
  }

  // 3. Default to localhost for development
  return 'http://localhost:3000';
}

/**
 * Validate all required environment variables
 * Throws detailed errors if any are missing
 */
export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    getDatabaseUrl();
  } catch (error) {
    errors.push(`Database: ${(error as Error).message}`);
  }

  try {
    getJwtSecret();
  } catch (error) {
    errors.push(`JWT: ${(error as Error).message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get environment info for debugging
 */
export function getEnvInfo() {
  return {
    nodeEnv: process.env.NODE_ENV,
    isProduction: isProduction(),
    isVercel: isVercel(),
    siteUrl: getSiteUrl(),
    hasDatabase: !!process.env.DATABASE_URL || !!process.env.POSTGRES_URL || !!process.env.POSTGRES_PRISMA_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasCronKey: !!process.env.CRON_API_KEY,
  };
}
