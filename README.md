# FeedCentral

Production-grade RSS aggregator with admin panel, full-text search, and self-hosted cron refresh.

## Architecture

- **Frontend:** Next.js 14 (App Router, React Server Components)
- **Backend:** Next.js API Routes (serverless functions)
- **Database:** Vercel Postgres (or self-hosted PostgreSQL)
- **Authentication:** JWT with httpOnly cookies, bcrypt password hashing
- **RSS Parsing:** Robust polling with retry, timeout, and error handling
- **Security:** Input validation (Zod), rate limiting, HTML sanitization, parameterized SQL

## Features

- 8 curated RSS categories (Technology, Cybersecurity, World News, Business, Science, Programming, DevOps, AI/ML)
- Full-text search with PostgreSQL tsvector
- Automatic article cleanup (90+ days old)
- Admin dashboard for source management
- Self-hosted cron integration for feed refresh
- Modern, minimalistic, responsive UI

## Quickstart

### 1. Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Vercel Postgres or self-hosted)
- (Optional) Self-hosted server for cron (Debian-based recommended)

### 2. Installation

```bash
cd feedcentral
npm install
```

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
cp .env.local.example .env.local
```

Generate required secrets:

```bash
# JWT Secret
openssl rand -base64 32

# Admin password hash (password: changeme)
node -e "console.log(require('bcrypt').hashSync('changeme', 10))"

# Cron API key
openssl rand -hex 32
```

Update `.env.local` with generated values.

### 4. Database Setup

Apply migrations manually via Vercel Postgres UI or `psql`:

```bash
psql $DATABASE_URL < migrations/001_init.sql
```

Or let the app auto-seed on first `/api/refresh-feeds` call.

### 5. Development

```bash
npm run dev
```

Visit `http://localhost:3000` for the home feed and `http://localhost:3000/admin/login` for admin panel.

### 6. Initial Data

Trigger feed refresh manually:

```bash
curl -X POST http://localhost:3000/api/refresh-feeds \
  -H "X-Cron-Key: YOUR_CRON_API_KEY"
```

## Deployment

### Option A: Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add Vercel Postgres integration
4. Set environment variables in Vercel dashboard
5. Deploy

### Option B: Self-Hosted

1. Build: `npm run build`
2. Start: `npm start`
3. Use Nginx reverse proxy with SSL (Cloudflare)

## Self-Hosted Cron Setup

On your Debian server (Terraton/Citadel):

```bash
# Copy script
scp scripts/refresh-feeds.sh user@your-server:/opt/feedcentral/
chmod +x /opt/feedcentral/refresh-feeds.sh

# Add to crontab
crontab -e

# Add this line (runs every 15 minutes)
*/15 * * * * CRON_API_KEY=your-key FEEDCENTRAL_API_URL=https://feedcentral.yourdomain.com /opt/feedcentral/refresh-feeds.sh >> /var/log/feedcentral-refresh.log 2>&1
```

Monitor logs:

```bash
tail -f /var/log/feedcentral-refresh.log
```

## API Reference

### Public Endpoints

- `GET /api/articles?category=Technology&search=AI&page=1&limit=20` - List articles
- `GET /api/sources` - List active sources grouped by category

### Admin Endpoints (require authentication)

- `POST /api/auth/login` - Login (body: `{ username, password }`)
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Change password
- `GET /api/stats` - Get stats (total articles, sources, last refresh)
- `POST /api/sources` - Add source (body: `{ name, url, category }`)
- `DELETE /api/sources/:id` - Delete source
- `POST /api/refresh-feeds` - Trigger feed refresh (requires JWT or X-Cron-Key header)

## Security Notes

- **Secrets:** Never commit `.env.local`. Always use environment variables.
- **Password:** Change default admin password on first login.
- **Cron Key:** Rotate `CRON_API_KEY` regularly and update crontab.
- **CORS:** Restrict `CORS_ORIGIN` to your domain in production.
- **Rate Limits:** Adjust limits in `lib/rate-limit.ts` based on traffic.

## Troubleshooting

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Check network/firewall rules
- Ensure migrations are applied

**Feed refresh failures:**
- Check `/var/log/feedcentral-refresh.log` on cron server
- Verify `CRON_API_KEY` matches between cron script and Vercel env
- Test manually: `curl -X POST ... -H "X-Cron-Key: ..."`

**Search not working:**
- Ensure PostgreSQL `search_vector` trigger is active
- Verify GIN index exists: `\d articles` in `psql`

## Future Enhancements

- Monorepo split (separate frontend/API)
- Redis caching for article queries
- Email notifications for new articles
- User-specific feeds and bookmarks
- Mobile app (React Native)

## License

MIT

## Author

BENZOO - [benzoogataga.com](https://benzoogataga.com)
