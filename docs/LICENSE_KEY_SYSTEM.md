# Premium License Key System

## Overview

This document describes the premium license key system for FeedCentral, including security measures to prevent cross-instance abuse.

## Security Architecture

### Instance Binding

Each FeedCentral instance is uniquely identified by a **LICENSE_SIGNING_SECRET** environment variable. This creates an instance-specific identity:

1. **Instance ID**: Derived from `SHA256(LICENSE_SIGNING_SECRET)` (first 16 characters)
2. **Key Signature**: Each license key is signed with HMAC-SHA256 using the signing secret
3. **Verification**: Keys can only be redeemed on the instance that generated them

### Why This Prevents Fork Abuse

**Scenario**: Someone forks FeedCentral and tries to:
- Use official instance keys on their fork → ❌ **Fails** (different instance ID + signature mismatch)
- Generate keys on their fork for the official instance → ❌ **Fails** (signature won't verify)
- Copy keys from database → ❌ **Fails** (signature verification requires the signing secret)

**Key Points**:
- Each deployment (official, fork, self-hosted) has a unique `LICENSE_SIGNING_SECRET`
- Keys are cryptographically bound to the instance that generated them
- No way to "steal" or transfer keys between instances without the signing secret
- Even with database access, keys cannot be forged or transferred

## Setup

### Environment Variables

Add to your `.env` or Vercel environment:

```bash
# Required: Instance-specific secret for license key signing
# Generate with: openssl rand -hex 32
LICENSE_SIGNING_SECRET=your-64-character-hex-string-here-minimum-32-chars
```

### Database Migration

Run the Prisma migration to add the LicenseKey model:

```bash
npx prisma migrate dev --name add_license_keys
```

Or for production:

```bash
npx prisma migrate deploy
```

## Usage

### For Admins: Generating Keys

1. Navigate to `/admin/licenses` (requires admin account)
2. Select license tier: **Premium** (50 custom sources) or **Pro** (unlimited)
3. Set duration in days (e.g., 365 for 1 year)
4. Optionally add notes for tracking (e.g., "Patreon batch #1")
5. Generate keys
6. Copy and distribute to users

**API Endpoint**:
```bash
POST /api/admin/licenses/generate
Authorization: Bearer <admin-token>

{
  "tier": "premium" | "pro",
  "duration": 365,
  "quantity": 5,
  "notes": "Optional tracking note"
}
```

### For Users: Redeeming Keys

Users can redeem keys via Settings page or API:

**API Endpoint**:
```bash
POST /api/user/licenses/redeem
Authorization: Bearer <user-token>

{
  "key": "FEED-XXXX-XXXX-XXXX-XXXX"
}
```

## License Tiers

### Free Tier (Default)
- 10 custom RSS sources
- All basic features

### Premium Tier
- 50 custom RSS sources
- Priority support
- Ad-free experience

### Pro Tier
- Unlimited custom RSS sources
- Priority support
- Ad-free experience
- Early access to features

## Database Schema

```prisma
model LicenseKey {
  id          String    @id @default(cuid())
  key         String    @unique           // FEED-XXXX-XXXX-XXXX-XXXX
  tier        String                      // "premium" | "pro"
  duration    Int                         // Days
  
  // Issuance
  issuedBy    String                      // Admin user ID
  issuedAt    DateTime  @default(now())
  
  // Redemption
  redeemedBy  String?   @unique           // User ID (null if unredeemed)
  redeemedAt  DateTime?
  expiresAt   DateTime?                   // Set when redeemed
  
  // Instance Binding (Security)
  instanceId  String                      // Prevents cross-instance use
  signature   String                      // HMAC-SHA256 verification
  
  // Management
  notes       String?   @db.Text
  isRevoked   Boolean   @default(false)
  revokedAt   DateTime?
  revokedBy   String?
}
```

## Security Features

✅ **Instance-specific signing**: Keys only work on the instance that created them
✅ **HMAC-SHA256 signatures**: Prevents tampering and forgery
✅ **One-time redemption**: Each key can only be used once
✅ **Revocation support**: Admins can revoke keys and downgrade users
✅ **Database tracking**: Full audit trail of issuance and redemption
✅ **Format validation**: Keys must match `FEED-XXXX-XXXX-XXXX-XXXX` pattern

## API Routes

### Admin Routes (Require Admin Auth)

- `POST /api/admin/licenses/generate` - Generate new license keys
- `GET /api/admin/licenses` - List all keys with filtering
- `PATCH /api/admin/licenses` - Revoke a license key

### User Routes (Require User Auth)

- `POST /api/user/licenses/redeem` - Redeem a license key

## FAQ

**Q: Can someone use my official instance's keys on their fork?**
A: No. Keys are cryptographically bound to the instance via HMAC signature. Forks have different `LICENSE_SIGNING_SECRET` values, so signatures won't verify.

**Q: What if someone copies my LICENSE_SIGNING_SECRET?**
A: Treat it like a password. If compromised, rotate it immediately. All old keys will become invalid, but you can generate new ones.

**Q: Can I transfer keys between my staging and production environments?**
A: No, unless they share the same `LICENSE_SIGNING_SECRET` (not recommended). Each environment should generate its own keys.

**Q: How do I rotate the signing secret?**
A: 
1. Generate a new secret
2. Update `LICENSE_SIGNING_SECRET` environment variable
3. All old keys become invalid (signature verification fails)
4. Generate new keys with the new secret

**Q: What happens if a user's license expires?**
A: Their account is automatically downgraded to free tier (handled by cron job or manual check).

## Testing

For development/testing, if `LICENSE_SIGNING_SECRET` is not set, the system uses a development fallback with a warning. **Never use this in production.**

## Monitoring

Track license usage in the admin panel:
- Total keys generated
- Unredeemed keys
- Active licenses
- Revoked licenses
- Revenue potential (if using paid tiers)

## Best Practices

1. **Generate unique keys per user** - Don't reuse keys
2. **Add tracking notes** - e.g., "Patreon Q4 2024", "Black Friday promo"
3. **Monitor redemption rates** - Low rates may indicate issues
4. **Revoke suspicious keys** - If abuse is detected
5. **Keep LICENSE_SIGNING_SECRET secure** - Never commit to Git
6. **Regular audits** - Review active licenses quarterly
