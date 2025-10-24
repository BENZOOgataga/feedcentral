# Quick Start Guide

Get FeedCentral running in 5 minutes! ⚡

## 🚀 For Local Development

### 1. Clone & Install
```bash
git clone https://github.com/BENZOOgataga/feedcentral.git
cd feedcentral
npm install
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# Minimum required: DATABASE_URL and JWT_SECRET
```

**Quick .env setup:**
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/feedcentral"
JWT_SECRET="$(openssl rand -base64 32)"
```

### 3. Setup Database
```bash
# One command to set up everything!
npm run setup

# Or run individually:
# npm run db:generate
# npm run db:push
# npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Visit **http://localhost:3000** and login:
- Email: `admin@feedcentral.local`
- Password: `admin123`

---

## ☁️ For Production (Vercel)

### 1. Prepare Your Database
- **Option A**: Create Vercel Postgres database in your Vercel dashboard
- **Option B**: Use external PostgreSQL (Neon, Supabase, etc.)

### 2. Set Environment Variables in Vercel
Go to your project → Settings → Environment Variables:

**Required:**
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`

**Optional (if not using Vercel Postgres):**
- `DATABASE_URL` - Your PostgreSQL connection string

**Recommended:**
- `ADMIN_PASSWORD` - Change from default `admin123`

### 3. Deploy
```bash
# Option A: GitHub Integration (Recommended)
# Push to GitHub, then import to Vercel

# Option B: Vercel CLI
npm i -g vercel
vercel --prod
```

### 4. Initialize Database
```bash
vercel env pull
npm run db:push
npm run db:seed
```

Done! Your app is live 🎉

---

## 🔍 Verify Environment

Before starting, check if everything is configured:
```bash
npm run check-env
```

This will validate:
- ✅ Database connection
- ✅ JWT secret
- ✅ All required environment variables

---

## 📚 Need More Help?

- **Full Setup Guide**: [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md)
- **Troubleshooting**: Check environment validation output
- **Questions**: Open an issue on GitHub

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check-env` | Validate environment configuration |
| `npm run setup` | One-command database setup |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio |

---

## ⚡ Super Quick Setup (Copy-Paste)

```bash
# Clone and install
git clone https://github.com/BENZOOgataga/feedcentral.git
cd feedcentral
npm install

# Configure (edit these values!)
cat > .env << EOL
DATABASE_URL="postgresql://user:password@localhost:5432/feedcentral"
JWT_SECRET="$(openssl rand -base64 32)"
ADMIN_PASSWORD="your-secure-password"
EOL

# Setup and run
npm run setup
npm run dev

# Login at http://localhost:3000
# Email: admin@feedcentral.local
# Password: your-secure-password (or admin123 if not changed)
```

That's it! 🎊
