# Database Setup

## Prerequisites

- PostgreSQL 14+ installed and running
- Database credentials configured in `.env`

## Initial Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure DATABASE_URL in `.env`:**
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/feedcentral"
   ```

3. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

4. **Push schema to database:**
   ```bash
   npm run db:push
   ```
   Or create migration:
   ```bash
   npm run db:migrate
   ```

5. **Seed initial data:**
   ```bash
   npm run db:seed
   ```

## Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database (no migration) |
| `npm run db:migrate` | Create and apply migration |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:reset` | Reset database and re-seed |

## Default Credentials

After seeding, the following admin user is created:

- **Email:** `admin@feedcentral.local`
- **Password:** `admin123`

**⚠️ Change this password immediately in production.**

## Schema Overview

- **Users** - Admin and regular users
- **Categories** - Content organization (Tech, Science, Business, Security)
- **Sources** - RSS feed sources
- **Articles** - Fetched RSS articles
- **FeedJobs** - RSS fetch job logs

## Notes

- All timestamps use UTC
- Soft deletes not implemented (uses CASCADE)
- Article URLs are unique (prevents duplicates)
- Sources can be active/inactive
