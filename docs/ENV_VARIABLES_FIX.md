# Environment Variables Fix - 24 Oct 2025

## Changes Made

Updated all environment configuration to match actual Vercel project variables:

### Variable Name Changes
- ❌ `POSTGRES_PRISMA_URL` → ✅ `PRISMA_DATABASE_URL`

### New Variables Added
- ✅ `ADMIN_PASSWORD_HASH` - Pre-hashed admin password (production security)
- ✅ `CORS_ORIGIN` - API CORS configuration

### Files Updated
1. `.env.example` - Complete template with all actual variables
2. `lib/env.ts` - Database URL fallback priority, password hash support
3. `scripts/check-env.js` - Validation with correct variable names
4. `prisma/seed.ts` - Support for pre-hashed passwords
5. All documentation files - Corrected variable references

### Database URL Priority (Updated)
1. `PRISMA_DATABASE_URL` (Vercel Postgres pooled)
2. `POSTGRES_URL` (Vercel Postgres direct)
3. `DATABASE_URL` (local development)

### Admin Password Options
**Development (local):**
```env
ADMIN_PASSWORD="admin123"  # Plain text, hashed during seed
```

**Production (Vercel):**
```env
# Option 1: Plain text (not recommended)
ADMIN_PASSWORD="SecurePassword"

# Option 2: Pre-hashed (recommended)
ADMIN_PASSWORD_HASH="$2a$10$..."  # Takes priority if both are set
```

Generate hash:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10))"
```

### Complete Vercel Variables List
```
PRISMA_DATABASE_URL  # Auto-injected by Vercel Postgres
POSTGRES_URL         # Auto-injected by Vercel Postgres
DATABASE_URL         # Local development
CORS_ORIGIN          # API CORS configuration
NEXT_PUBLIC_SITE_URL # Auto-detected on Vercel
CRON_API_KEY         # Cron endpoint security
ADMIN_PASSWORD_HASH  # Pre-hashed password (recommended)
ADMIN_USERNAME       # Admin email
JWT_SECRET           # Required (min 32 chars)
```

All documentation updated to reflect actual production configuration.
