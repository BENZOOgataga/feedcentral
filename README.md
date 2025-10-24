# FeedCentral

A professional RSS feed aggregator built with Next.js 14, designed to centralize news from verified sources with a clean, Vercel-like interface.

## Features

- 🎨 **Vercel-inspired design** - Clean, minimal, professional UI with dark-first theme
- 📰 **RSS aggregation** - Automatic fetching and normalization of RSS/Atom feeds
- 🔍 **Instant search** - Cmd+K search palette with keyboard navigation
- 🗂️ **Category filtering** - Organize articles by Technology, Science, Business, Security
- ⚡ **Real-time updates** - Automatic feed refresh every 30 minutes via Vercel Cron
- 🎭 **Smooth animations** - Framer Motion powered transitions and micro-interactions
- 🌙 **Theme switching** - Dark/light mode with system preference support
- 🔐 **Authentication** - JWT-based auth with admin panel
- 📊 **Analytics** - Vercel Analytics and Speed Insights integrated

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **Animations:** Framer Motion
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT + bcrypt
- **Deployment:** Vercel
- **RSS Parsing:** rss-parser

## Getting Started

### Quick Start (5 minutes)

See [docs/QUICK_START.md](docs/QUICK_START.md) for the fastest way to get running.

**Or use the one-command setup:**

```bash
npm install
npm run setup  # Validates environment, sets up database, seeds data
npm run dev    # Start development server
```

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BENZOOgataga/feedcentral.git
   cd feedcentral
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and secrets.
   
   See [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) for detailed configuration.

4. **Validate environment (optional but recommended):**
   ```bash
   npm run check-env
   ```

5. **Set up database:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

6. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

### Database Commands

```bash
npm run check-env      # Validate environment configuration
npm run setup          # One-command setup (check-env + db:generate + db:push + db:seed)
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Create migration
npm run db:seed        # Seed initial data
npm run db:studio      # Open Prisma Studio GUI
npm run db:reset       # Reset database
```

### Default Credentials

After seeding:
- **Email:** admin@feedcentral.local
- **Password:** admin123

⚠️ **Change these immediately in production.**

## Deployment

See [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) for comprehensive deployment guide covering both local and production environments.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Vercel-specific deployment instructions.

**Quick Deploy to Vercel:**
1. Connect GitHub repo to Vercel
2. Provision Vercel Postgres database
3. Set environment variables in Vercel dashboard (see `.env.example`)
4. Deploy automatically on push to `main`

**Environment Variables:**
- `DATABASE_URL` or `POSTGRES_URL` - Database connection string
- `JWT_SECRET` - Secret for signing JWTs (min 32 characters)
- `ADMIN_USERNAME` - Admin email (default: admin@feedcentral.local)
- `ADMIN_PASSWORD` - Admin password (default: admin123)
- `CRON_API_KEY` - Optional security for cron endpoints

See [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) for complete variable reference.

## Project Structure

```
feedcentral/
├── app/                 # Next.js App Router pages
│   ├── (app)/          # Main app pages (dashboard)
│   ├── admin/          # Admin panel
│   ├── api/            # API routes
│   └── article/        # Article reader
├── components/          # React components
│   ├── layout/         # TopNav, SideNav, AppTabs
│   ├── feed/           # FeedCard, FeedList
│   ├── ui/             # shadcn/ui components
│   └── theme/          # Theme provider and toggle
├── lib/                # Utilities and services
│   ├── prisma.ts       # Prisma client singleton
│   ├── rss-parser.ts   # RSS feed parser
│   ├── env.ts          # Environment config
│   └── utils.ts        # Helper functions
├── prisma/             # Database schema and migrations
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Seed script
├── docs/               # Documentation
└── types/              # TypeScript type definitions
```

## Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get running in 5 minutes
- **[Environment Setup](docs/ENVIRONMENT_SETUP.md)** - Local and production configuration
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Architecture, components, what's missing
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Vercel deployment instructions
- **[Database Setup](prisma/README.md)** - Database configuration
- **[Architecture Plan](docs/Plan_architecture.md)** - Original architecture plan
- **[UI/UX Specs](docs/UI_UX_Specs.md)** - Design and interaction specifications

## Development

```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript compiler
```

## Cron Jobs

RSS feeds are automatically fetched every 30 minutes via Vercel Cron.

**Manual trigger:**
```bash
curl -X POST http://localhost:3000/api/cron/fetch-feeds \
  -H "Authorization: Bearer YOUR_CRON_API_KEY"
```

## License

MIT

## Contributing

Contributions welcome! Please read the [Developer Guide](docs/DEVELOPER_GUIDE.md) first.
