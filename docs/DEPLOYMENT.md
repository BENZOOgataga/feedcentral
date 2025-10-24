# Deployment Guide - Vercel

## Prerequisites

- GitHub repository connected to Vercel
- Vercel Postgres database provisioned
- Environment variables configured in Vercel dashboard

## Environment Variables (Vercel Dashboard)

Based on your current setup, ensure these are configured:

### Database
- `POSTGRES_URL` - Provided automatically by Vercel Postgres
- `PRISMA_DATABASE_URL` - Provided automatically by Vercel Postgres  
- `DATABASE_URL` - Fallback, can point to POSTGRES_URL

### Authentication
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `ADMIN_USERNAME` - Admin email (default: admin@feedcentral.local)
- `ADMIN_PASSWORD_HASH` - bcrypt hash of admin password

### CORS & Site Configuration
- `CORS_ORIGIN` - Your production domain (e.g., https://feedcentral.vercel.app)
- `NEXT_PUBLIC_SITE_URL` - Public site URL

### Cron Job Security
- `CRON_API_KEY` - Secret key for cron endpoints (generate random string)

## Deployment Steps

### 1. Connect Repository

Connect your GitHub repository to Vercel:
- Go to Vercel Dashboard → Add New Project
- Import your GitHub repository
- Vercel will auto-detect Next.js

### 2. Provision Database

In Vercel project settings:
- Storage → Create Database → Postgres
- Vercel automatically sets `POSTGRES_URL` and `PRISMA_DATABASE_URL`

### 3. Set Environment Variables

In Vercel project settings → Environment Variables, add:

```bash
# Authentication (required)
JWT_SECRET=<generate-with-openssl-rand-base64-32>

# Admin credentials (optional, for seeding)
ADMIN_USERNAME=admin@feedcentral.local
ADMIN_PASSWORD_HASH=<bcrypt-hash-of-password>

# CORS (recommended)
CORS_ORIGIN=https://feedcentral.vercel.app

# Cron security (recommended)
CRON_API_KEY=<random-secret-key>

# Site URL (optional, auto-detected)
NEXT_PUBLIC_SITE_URL=https://feedcentral.vercel.app
```

**Note:** `POSTGRES_URL` and `PRISMA_DATABASE_URL` are automatically provided by Vercel Postgres.

### 4. Configure Build Settings

Vercel auto-detects Next.js, but verify:

- **Framework Preset:** Next.js
- **Build Command:** `prisma generate && next build`
- **Install Command:** `npm install`
- **Output Directory:** `.next` (default)

Alternatively, use the provided `vercel.json` configuration.

### 5. Database Setup

After first deployment, run migrations:

```bash
# Option 1: Using Vercel CLI locally
vercel env pull .env.production
npm run db:push

# Option 2: Run seed script manually
npm run db:seed
```

Or create a one-time deployment script in Vercel dashboard.

### 6. Enable Vercel Cron

Cron jobs are defined in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-feeds",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

Vercel automatically schedules this on deployment.

**Verify cron is working:**
- Check Vercel Dashboard → Deployments → Functions → Cron Logs
- Manually trigger: `POST https://your-domain.vercel.app/api/cron/fetch-feeds` with `Authorization: Bearer <CRON_API_KEY>`

### 7. Post-Deployment Verification

1. **Check database connection:**
   - Visit `/api/articles` - should return empty array or seeded articles

2. **Test authentication:**
   - Login with admin credentials

3. **Verify RSS fetching:**
   - Check cron logs in Vercel dashboard
   - Manually trigger: `curl -X POST https://your-domain.vercel.app/api/cron/fetch-feeds -H "Authorization: Bearer YOUR_CRON_API_KEY"`

4. **Monitor errors:**
   - Vercel Dashboard → Logs → Real-time logs

## Continuous Deployment

Every push to `main` branch triggers:
1. Install dependencies
2. Generate Prisma client
3. Build Next.js app
4. Deploy to Vercel
5. Cron jobs are automatically scheduled

## Troubleshooting

### Prisma Client Generation Fails
- Ensure `POSTGRES_URL` or `DATABASE_URL` is set
- Check `vercel.json` build command includes `prisma generate`

### Cron Jobs Not Running
- Verify `vercel.json` cron configuration
- Check Vercel Dashboard → Cron Jobs status
- Ensure cron endpoint is not rate-limited

### Database Connection Issues
- Verify Vercel Postgres is provisioned
- Check connection pooling limits (default: 100)
- Use `POSTGRES_URL` for connection pooling (not direct URL)

### Environment Variables Not Loading
- Ensure variables are set for correct environments (Production/Preview/Development)
- Redeploy after changing env vars

## Security Checklist

- [ ] `JWT_SECRET` is strong (32+ characters, random)
- [ ] `CRON_API_KEY` is set and secret
- [ ] `ADMIN_PASSWORD_HASH` is bcrypt hashed (not plain text)
- [ ] `CORS_ORIGIN` restricts API access to your domain
- [ ] Admin credentials changed from default
- [ ] Database uses connection pooling (`POSTGRES_URL`)

## Performance Optimization

- **Edge Functions:** API routes run on Vercel Edge Network
- **Connection Pooling:** Use `POSTGRES_URL` (includes pgBouncer)
- **Caching:** Implement SWR/React Query for client-side caching
- **ISR:** Use Incremental Static Regeneration for landing page

## Monitoring

- **Vercel Analytics:** Automatically tracks page views and performance
- **Logs:** Real-time logs in Vercel dashboard
- **Cron Job Logs:** Check execution history and errors
- **Database Metrics:** Monitor connection count and query performance in Vercel Storage

## Cost Considerations

**Vercel Pro Plan:**
- Unlimited bandwidth
- 1000 cron job executions/month
- Edge Functions (serverless)

**Vercel Postgres:**
- Connection pooling via pgBouncer
- 100 max connections
- Monitor usage in Vercel dashboard

## Next Steps

1. Set up monitoring/alerting for failed cron jobs
2. Implement error tracking (Sentry)
3. Configure custom domain
4. Set up preview environments for PRs
5. Enable Vercel Speed Insights and Web Vitals monitoring
