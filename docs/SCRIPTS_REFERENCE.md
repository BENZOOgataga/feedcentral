# Scripts Reference

Quick reference for all npm scripts in the FeedCentral project.

---

## 🚀 Development Scripts

### Start Development Server
```bash
npm run dev
```
Starts Next.js development server on http://localhost:3000

### Build for Production
```bash
npm run build
```
Creates optimized production build

### Start Production Server
```bash
npm run start
```
Runs production build locally (must run `npm run build` first)

---

## ✅ Environment & Setup

### Validate Environment
```bash
npm run check-env
```
**What it does:**
- Checks for required environment variables
- Validates JWT_SECRET minimum length (32 chars)
- Displays environment information
- Shows helpful error messages if configuration is missing

**When to use:**
- Before running the app for the first time
- When troubleshooting environment issues
- After updating .env file

### One-Command Setup
```bash
npm run setup
```
**What it does:**
- Runs `check-env` to validate configuration
- Runs `db:generate` to generate Prisma client
- Runs `db:push` to sync database schema
- Runs `db:seed` to populate initial data

**When to use:**
- First time project setup
- After pulling database schema changes
- When resetting development environment

---

## 🗄️ Database Scripts

### Generate Prisma Client
```bash
npm run db:generate
```
Generates Prisma client based on `prisma/schema.prisma`

**When to use:**
- After modifying Prisma schema
- First time setup
- After pulling schema changes from Git

### Push Schema to Database
```bash
npm run db:push
```
Syncs Prisma schema to database without creating migrations

**When to use:**
- Development environment (quick schema changes)
- First time database setup
- Prototyping schema changes

**Note:** Use `db:migrate` for production

### Create Migration
```bash
npm run db:migrate
```
Creates a new migration file and applies it

**When to use:**
- Production deployments
- When you want to track schema history
- Team collaboration (migrations committed to Git)

### Seed Database
```bash
npm run db:seed
```
Populates database with initial data:
- Categories (Technology, Science, Business, Security)
- Default RSS sources
- Admin user (credentials from environment)

**When to use:**
- First time setup
- After resetting database
- Testing with fresh data

### Open Prisma Studio
```bash
npm run db:studio
```
Opens visual database browser at http://localhost:5555

**When to use:**
- Viewing database contents
- Manual data editing
- Debugging data issues

### Reset Database
```bash
npm run db:reset
```
**⚠️ WARNING:** Deletes all data and resets database

**What it does:**
- Drops database
- Recreates schema
- Runs seed script

**When to use:**
- Starting fresh in development
- Clearing test data
- Fixing corrupted development database

**Never use in production!**

---

## 🧪 Code Quality

### Run Linter
```bash
npm run lint
```
Runs ESLint to check code quality

**When to use:**
- Before committing code
- Continuous integration
- Code review preparation

### Type Check
```bash
npm run type-check
```
Runs TypeScript compiler without emitting files

**When to use:**
- Before committing code
- Checking for type errors
- Continuous integration

---

## 📦 Complete Workflows

### First Time Setup (New Developer)
```bash
npm install
cp .env.example .env
# Edit .env with your values
npm run setup
npm run dev
```

### Daily Development
```bash
git pull
npm install  # If package.json changed
npm run db:generate  # If schema.prisma changed
npm run dev
```

### After Schema Changes
```bash
npm run db:generate
npm run db:push
npm run db:seed  # If seed data changed
```

### Before Committing
```bash
npm run lint
npm run type-check
npm run build  # Ensure production build works
```

### Troubleshooting Setup Issues
```bash
npm run check-env  # Validate environment
npm run db:reset   # Reset database if corrupted
npm run setup      # Re-run full setup
```

---

## 🔧 Script Combinations

### Full Reset and Restart
```bash
npm run db:reset && npm run dev
```

### Validate and Build
```bash
npm run check-env && npm run build
```

### Schema Update Workflow
```bash
# Edit prisma/schema.prisma
npm run db:generate
npm run db:push
# Optionally update seed data
npm run db:seed
```

---

## 📝 Environment Variables Required

Scripts that require environment variables:

| Script | Requires | Falls Back To |
|--------|----------|---------------|
| `check-env` | DATABASE_URL or POSTGRES_URL, JWT_SECRET | - |
| `setup` | Same as check-env | - |
| `db:*` | DATABASE_URL or POSTGRES_URL or PRISMA_DATABASE_URL | - |
| `dev` | Same as db:* + JWT_SECRET | - |
| `build` | Same as dev | - |
| `start` | Same as dev | - |

See [docs/ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) for complete environment configuration guide.

---

## 🐛 Common Issues

### "Missing environment variables"
**Solution:**
```bash
cp .env.example .env
# Edit .env
npm run check-env
```

### "Prisma Client not generated"
**Solution:**
```bash
npm run db:generate
```

### "Database connection error"
**Solution:**
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env
3. Run `npm run check-env` to verify

### "Build fails with type errors"
**Solution:**
```bash
npm run type-check  # See detailed errors
npm run db:generate  # Regenerate types
```

### "Port 3000 already in use"
**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
PORT=3001 npm run dev
```

---

## 🔗 Related Documentation

- **[Quick Start Guide](QUICK_START.md)** - 5-minute setup
- **[Environment Setup](ENVIRONMENT_SETUP.md)** - Detailed environment configuration
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Pre-deployment steps
- **[Developer Guide](DEVELOPER_GUIDE.md)** - Architecture and patterns

---

**Tip:** Add these aliases to your shell for faster development:

```bash
# .bashrc or .zshrc
alias fcd='cd ~/projects/feedcentral'
alias fcdev='npm run dev'
alias fcsetup='npm run setup'
alias fccheck='npm run check-env'
alias fcstudio='npm run db:studio'
```
