# Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### Local Testing
- [ ] All dependencies installed (`npm install`)
- [ ] Environment validated (`npm run check-env`)
- [ ] Database setup complete (`npm run setup`)
- [ ] Application runs locally (`npm run dev`)
- [ ] Login works with admin credentials
- [ ] RSS feeds can be added and fetched
- [ ] Search functionality works
- [ ] All pages render without errors
- [ ] TypeScript builds successfully (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)

### Security Review
- [ ] Default admin password changed (set via `ADMIN_PASSWORD` env var)
- [ ] JWT secret is strong (min 32 characters, generated with `openssl rand -base64 32`)
- [ ] `.env` file is in `.gitignore` (should already be there)
- [ ] No sensitive data in code or committed files
- [ ] `.env.example` is up to date with all required variables
- [ ] CRON_API_KEY set for production (optional but recommended)

### Code Quality
- [ ] All console.log statements removed or converted to proper logging
- [ ] Error handling in place for all API routes
- [ ] Loading states implemented for all async operations
- [ ] Empty states for all list views
- [ ] 404 and error pages working correctly

## GitHub Repository

### Repository Setup
- [ ] Code pushed to GitHub repository
- [ ] `main` branch is up to date
- [ ] `.env` file NOT committed (check with `git status`)
- [ ] `.env.example` IS committed and up to date
- [ ] README.md is complete and accurate
- [ ] All documentation files are up to date

### Branch Strategy
- [ ] Main branch protected (optional but recommended)
- [ ] Feature branches merged and deleted
- [ ] No merge conflicts

## Vercel Deployment

### Project Setup
- [ ] Vercel account created
- [ ] GitHub repository connected to Vercel
- [ ] Project name configured
- [ ] Framework preset set to "Next.js"
- [ ] Build command: `npm run build` (default)
- [ ] Output directory: `.next` (default)
- [ ] Install command: `npm install` (default)

### Environment Variables
**Required:**
- [ ] `POSTGRES_URL` or `DATABASE_URL` - Database connection string from Vercel Postgres
- [ ] `JWT_SECRET` - Generated with `openssl rand -base64 32` (min 32 chars)

**Recommended:**
- [ ] `ADMIN_USERNAME` - Custom admin email (default: admin@feedcentral.local)
- [ ] `ADMIN_PASSWORD` - Custom admin password (default: admin123)
- [ ] `CRON_API_KEY` - Security key for cron endpoints
- [ ] `NODE_ENV` - Set to `production` (usually automatic)

**Optional:**
- [ ] `NEXT_PUBLIC_SITE_URL` - Override site URL (auto-detected on Vercel)

### Database Setup
- [ ] Vercel Postgres database provisioned
- [ ] Database connection string copied to environment variables
- [ ] Environment variables saved in Vercel dashboard
- [ ] Prisma schema pushed to database (see "First Deployment" below)

### Domain Configuration (Optional)
- [ ] Custom domain added in Vercel dashboard
- [ ] DNS records configured
- [ ] SSL certificate provisioned (automatic on Vercel)

## First Deployment

### Initial Deploy
- [ ] Trigger deployment from Vercel dashboard or push to `main`
- [ ] Build logs checked for errors
- [ ] Deployment successful (status: Ready)
- [ ] Site URL accessible

### Database Migration
After successful build, run these commands locally to initialize the production database:

```bash
# Set production database URL temporarily
export DATABASE_URL="your-vercel-postgres-url"

# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db push

# Seed production database
npx prisma db seed
```

Or use Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Run seed command on Vercel
vercel env pull  # Download environment variables
npx prisma db push
npx prisma db seed
```

**Note:** Vercel doesn't automatically run migrations. You need to push schema and seed data manually for first deployment.

### Post-Deployment Verification
- [ ] Homepage loads correctly
- [ ] Login page accessible
- [ ] Can log in with admin credentials
- [ ] Dashboard loads (should be empty initially)
- [ ] Admin panel accessible
- [ ] Can add RSS sources
- [ ] Manual RSS fetch works (trigger via admin or API)
- [ ] Articles appear after feed fetch
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Article reader page works
- [ ] Theme toggle works
- [ ] All links and navigation working

## Cron Job Setup

### Configure Automatic Feed Fetching
- [ ] `vercel.json` cron configuration present (should be in repo)
- [ ] Cron job appears in Vercel dashboard (Settings → Cron Jobs)
- [ ] Cron schedule verified: `0 */30 * * *` (every 30 minutes)
- [ ] First cron execution successful (check deployment logs)
- [ ] New articles appear after cron runs

**Manual Cron Trigger (for testing):**
```bash
curl -X POST https://your-app.vercel.app/api/cron/fetch-feeds \
  -H "Authorization: Bearer YOUR_CRON_API_KEY"
```

## Monitoring & Maintenance

### Analytics Setup
- [ ] Vercel Analytics enabled (automatic if installed)
- [ ] Speed Insights enabled (automatic if installed)
- [ ] Error tracking configured (optional: Sentry, LogRocket)

### Monitoring
- [ ] Deployment status is "Ready"
- [ ] No build warnings or errors
- [ ] Function logs show no errors
- [ ] Database connections successful
- [ ] Cron jobs running successfully
- [ ] Response times acceptable

### Documentation
- [ ] Team members have access to Vercel project
- [ ] Environment variables documented (in Vercel dashboard or secure notes)
- [ ] Admin credentials shared securely with team
- [ ] Deployment process documented for future reference

## Post-Deployment Tasks

### Security
- [ ] Change default admin password via Vercel environment variable
- [ ] Redeploy to apply new admin password
- [ ] Rotate JWT secret periodically (set reminder)
- [ ] Enable Vercel authentication if needed
- [ ] Review access logs periodically

### Performance
- [ ] Check Vercel Speed Insights
- [ ] Monitor function execution times
- [ ] Review database query performance
- [ ] Optimize slow pages if needed

### Content
- [ ] Add initial RSS sources
- [ ] Verify feeds are fetching correctly
- [ ] Check article rendering quality
- [ ] Test with various RSS feed formats

### User Management (Optional)
- [ ] Create additional admin users if needed
- [ ] Set up user registration flow (if enabled)
- [ ] Configure user roles and permissions

## Troubleshooting Checklist

If deployment fails, check:
- [ ] Build logs for specific error messages
- [ ] All environment variables are set correctly
- [ ] Database connection string is valid
- [ ] No TypeScript errors in code
- [ ] Dependencies are compatible
- [ ] `.next` folder not committed to Git
- [ ] `node_modules` not committed to Git

If site loads but doesn't work:
- [ ] Check browser console for errors
- [ ] Verify API routes are responding (check Network tab)
- [ ] Check Vercel function logs
- [ ] Verify database connection is active
- [ ] Ensure Prisma schema is pushed to database
- [ ] Verify environment variables are accessible at runtime

## Rollback Plan

If deployment has critical issues:
1. [ ] Go to Vercel dashboard → Deployments
2. [ ] Find last working deployment
3. [ ] Click "..." → "Promote to Production"
4. [ ] Fix issues locally
5. [ ] Test thoroughly
6. [ ] Redeploy

---

## Quick Commands Reference

```bash
# Local validation
npm run check-env
npm run build
npm run lint

# Database operations (local)
npm run db:push
npm run db:seed
npm run db:studio

# Production database (with Vercel CLI)
vercel env pull
npx prisma db push
npx prisma db seed

# Manual cron trigger
curl -X POST https://your-app.vercel.app/api/cron/fetch-feeds \
  -H "Authorization: Bearer YOUR_CRON_API_KEY"
```

---

**Remember:** Always test in a preview deployment before promoting to production!

Use Vercel's preview deployments feature:
- Every PR creates a preview deployment
- Test thoroughly on preview URL
- Merge to `main` only after preview is verified
- Production deployment happens automatically on merge
