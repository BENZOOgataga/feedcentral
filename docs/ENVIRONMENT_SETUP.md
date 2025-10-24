# Environment Setup Guide

This guide explains how to configure FeedCentral for both local development and production deployment on Vercel.

## 🔧 Local Development Setup

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL database running locally
- Git installed

### 2. Clone and Install

```bash
# Clone the repository
git clone https://github.com/BENZOOgataga/feedcentral.git
cd feedcentral

# Install dependencies
npm install
```

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and configure the following:

```bash
# Database - Update with your local PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/feedcentral"

# JWT Secret - Generate a secure secret
# Run: openssl rand -base64 32
JWT_SECRET="your-generated-secret-here"

# Optional: Customize admin credentials
ADMIN_USERNAME="admin@feedcentral.local"
ADMIN_PASSWORD="admin123"

# Site URL (for development)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed with initial data (categories, sources, admin user)
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and login with:
- **Email**: `admin@feedcentral.local` (or your ADMIN_USERNAME)
- **Password**: `admin123` (or your ADMIN_PASSWORD)

---

## 🚀 Production Deployment (Vercel)

### 1. Prerequisites
- GitHub repository with your code
- Vercel account (free tier works)
- PostgreSQL database (Vercel Postgres, Neon, Supabase, etc.)

### 2. Set Up Database

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Select your project → Storage → Create Database
3. Choose "Postgres"
4. Vercel automatically sets environment variables:
   - `POSTGRES_URL`
   - `PRISMA_DATABASE_URL`
   - `POSTGRES_URL_NON_POOLING`

#### Option B: External PostgreSQL (Neon, Supabase, etc.)
1. Create a PostgreSQL database on your provider
2. Get the connection string
3. Add it manually in Vercel (see step 3 below)

### 3. Configure Environment Variables in Vercel

1. Go to your Vercel project → Settings → Environment Variables
2. Add the following variables:

**Required:**
```
JWT_SECRET = <generate with: openssl rand -base64 32>
```

**Optional (if not using Vercel Postgres):**
```
DATABASE_URL = postgresql://user:pass@host:5432/dbname
```

**Optional (for custom admin during seeding):**
```
ADMIN_USERNAME = admin@yourapp.com
ADMIN_PASSWORD = your-secure-password
```

**Optional (for custom domain):**
```
NEXT_PUBLIC_SITE_URL = https://yourdomain.com
```

**Optional (for securing cron endpoint):**
```
CRON_API_KEY = <generate with: openssl rand -hex 32>
```

**Optional (for production admin security):**
```bash
# Generate a bcrypt hash for your admin password
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-secure-password', 10))"

# Then set in Vercel:
ADMIN_PASSWORD_HASH = "$2a$10$..." # Output from above command
```

**Note:** If you set `ADMIN_PASSWORD_HASH`, the `ADMIN_PASSWORD` variable is ignored.

### 4. Deploy to Vercel

#### Method 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and configure build settings
5. Click "Deploy"

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 5. Run Database Migrations

After first deployment:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Pull environment variables
vercel env pull

# Run Prisma migrations
npm run db:push

# Seed the database
npm run db:seed
```

Alternatively, you can run these in Vercel's terminal (if available in your plan).

### 6. Configure Cron Jobs (Automated RSS Fetching)

The `vercel.json` file already configures a cron job. Vercel will automatically:
- Trigger `/api/cron/fetch-feeds` every 30 minutes
- Use Vercel's built-in cron authentication

**Optional: Add Extra Security**
If you set `CRON_API_KEY` in environment variables, the endpoint will require it.

---

## 🔐 Security Best Practices

### Development
- ✅ Never commit `.env` file to Git
- ✅ Use `.env.example` to document required variables
- ✅ Keep `.env` in `.gitignore`
- ✅ Use strong, unique JWT_SECRET

### Production
- ✅ Use different JWT_SECRET than development
- ✅ Change default admin password after first login
- ✅ Use connection pooling for database (Vercel Postgres does this automatically)
- ✅ Enable HTTPS only (Vercel does this automatically)
- ✅ Set secure admin credentials via environment variables

---

## 📋 Environment Variables Reference

### Required Variables

| Variable | Description | Local Dev | Production |
|----------|-------------|-----------|------------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Required | ⚠️ If not using Vercel Postgres |
| `JWT_SECRET` | Secret for JWT tokens (min 32 chars) | ✅ Required | ✅ Required |

### Optional Variables

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `POSTGRES_URL` | Vercel Postgres direct URL | - | Auto-set by Vercel |
| `PRISMA_DATABASE_URL` | Vercel Postgres pooled URL | - | Auto-set by Vercel |
| `ADMIN_USERNAME` | Admin email for seeding | `admin@feedcentral.local` | - |
| `ADMIN_PASSWORD` | Admin password (plain text) | `admin123` | Change in production! |
| `ADMIN_PASSWORD_HASH` | Pre-hashed admin password | - | Use instead of ADMIN_PASSWORD in production |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | `http://localhost:3000` | Auto-detected on Vercel |
| `CORS_ORIGIN` | Allowed CORS origins | Site URL | For API requests |
| `CRON_API_KEY` | API key for cron security | - | Recommended for production |

**Note:** If both `ADMIN_PASSWORD` and `ADMIN_PASSWORD_HASH` are set, `ADMIN_PASSWORD_HASH` takes priority.

---

## 🔍 Troubleshooting

### "Database URL not configured"
- **Local**: Ensure `.env` file exists with `DATABASE_URL`
- **Production**: Check Vercel environment variables are set

### "JWT_SECRET not configured"
- **Local**: Add `JWT_SECRET` to `.env` file
- **Production**: Add in Vercel environment variables

### Database connection fails
- **Local**: Check PostgreSQL is running and credentials are correct
- **Production**: Verify database URL is correct and database is accessible

### Prisma Client not generated
```bash
npm run db:generate
```

### Seed fails
```bash
# Ensure database is accessible
npm run db:push

# Run seed again
npm run db:seed
```

---

## 🔄 Workflow Summary

### Local Development
```bash
1. cp .env.example .env
2. Edit .env with your settings
3. npm install
4. npm run db:generate
5. npm run db:push
6. npm run db:seed
7. npm run dev
```

### Production Deployment
```bash
1. Push code to GitHub
2. Import to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy
5. Run migrations (vercel env pull + npm run db:push)
6. Seed database (npm run db:seed)
7. Done! 🎉
```

---

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
