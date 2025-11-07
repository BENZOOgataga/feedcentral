# FeedCentral

A professional RSS feed aggregator built with Next.js 14, designed to centralize news from verified sources with a clean, Vercel-inspired interface. Stay informed without the noise, ads, or algorithmic manipulation.

## ✨ Features

### Core Functionality
- 📰 **RSS Feed Aggregation** - Automatic fetching and normalization of RSS/Atom feeds from trusted sources
- � **Automated Updates** - Scheduled feed refresh every 30 minutes via Vercel Cron jobs
- 🗂️ **Smart Categorization** - Organize articles by Technology, Science, Business, and Security
- 🔍 **Full-text Search** - PostgreSQL-powered search across titles, descriptions, and content with relevance ranking
- 📑 **Bookmarks System** - Save articles permanently with user-linked bookmarks that survive article cleanup
- 🗑️ **Smart Cleanup** - Three-tier article lifecycle: soft-delete (7 days), preservation for bookmarks, hard-delete (14 days)

### User Experience
- 🎨 **Vercel-inspired Design** - Clean, minimal, professional UI with dark-first theme
- 🌙 **Theme Switching** - Dark/light mode with system preference support
- ⚡ **Instant Search** - Cmd+K search palette with keyboard navigation
- 🎭 **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ♿ **Accessibility** - WCAG AA compliant with keyboard navigation and screen reader support

### Authentication & Security
- 🔐 **JWT Authentication** - Secure httpOnly cookie-based authentication with 7-day sessions
- 👥 **User Management** - Role-based access control (ADMIN/USER)
- 🛡️ **Protected Routes** - Middleware-protected API endpoints and admin pages
- 🔑 **Password Security** - bcrypt hashing with salt rounds

### Admin Panel
- 🎛️ **Source Management** - Add, edit, toggle, and delete RSS sources
- 📊 **Job Monitoring** - Real-time feed refresh job tracking with status indicators
- 👤 **User Administration** - Manage user accounts and permissions
- 📈 **Dashboard Statistics** - Total articles, active sources, job history

### Developer Features
- 📊 **Analytics** - Vercel Analytics and Speed Insights integrated
- 🚀 **TypeScript** - Full type safety across the entire codebase
- 🗄️ **Prisma ORM** - Type-safe database queries with PostgreSQL
- 🎯 **RESTful API** - Well-structured API routes with consistent responses
- 📝 **Comprehensive Logging** - Detailed job logs and error tracking

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router) with React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Components:** shadcn/ui (Radix UI primitives)
- **Animations:** Framer Motion for smooth transitions
- **Icons:** Lucide React
- **Theme:** next-themes for dark/light mode

### Backend
- **Runtime:** Node.js with Edge Runtime support
- **Database:** PostgreSQL 14+
- **ORM:** Prisma 6 with driver adapters
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **RSS Parsing:** rss-parser with custom normalization
- **Cron Jobs:** Vercel Cron for automated feed fetching

### Developer Tools
- **Analytics:** Vercel Analytics & Speed Insights
- **Fonts:** Geist Sans & Geist Mono
- **Linting:** ESLint with Next.js config
- **Type Checking:** TypeScript strict mode
- **Package Manager:** npm

### Infrastructure
- **Deployment:** Vercel (optimized)
- **Database Hosting:** Vercel Postgres or any PostgreSQL provider
- **Edge Functions:** API routes with edge runtime
- **Monitoring:** Built-in job logging and error tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL 14+ (local or cloud-hosted)
- npm or yarn package manager
- Git

### Quick Start (5 minutes)

The fastest way to get FeedCentral running locally:

```bash
# Clone the repository
git clone https://github.com/BENZOOgataga/feedcentral.git
cd feedcentral

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# One-command setup (validates env, generates Prisma client, pushes schema, seeds data)
npm run setup

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Detailed Setup

#### 1. Clone and Install

```bash
git clone https://github.com/BENZOOgataga/feedcentral.git
cd feedcentral
npm install
```

#### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database (use one of these)
DATABASE_URL="postgresql://user:password@localhost:5432/feedcentral"
# OR for Vercel Postgres
POSTGRES_URL="postgres://..."

# JWT Secret (min 32 characters, generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Admin Credentials (for initial setup)
ADMIN_USERNAME="admin@feedcentral.local"
ADMIN_PASSWORD="admin123"

# Optional: Cron job security
CRON_API_KEY="your-cron-secret-key"

# Optional: Database seeding security
SEED_SECRET_KEY="your-seed-secret-key"
```

📝 See [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) for complete configuration guide.

#### 3. Database Setup

```bash
# Validate environment variables
npm run check-env

# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed with initial data (categories, sources, admin user)
npm run db:seed
```

Or use the all-in-one command:

```bash
npm run setup
```

#### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Default Credentials

After seeding, you can login with:
- **Email:** `admin@feedcentral.local` (or your ADMIN_USERNAME)
- **Password:** `admin123` (or your ADMIN_PASSWORD)

⚠️ **Important:** Change these credentials immediately in production!

## 🚀 Deployment

### Deploy to Vercel (Recommended)

FeedCentral is optimized for Vercel deployment with zero configuration.

#### Quick Deploy

1. **Connect Repository**
   - Push your code to GitHub
   - Import project in Vercel dashboard
   - Vercel auto-detects Next.js configuration

2. **Configure Database**
   - Add Vercel Postgres from the Storage tab
   - Database URL is automatically added to environment variables

3. **Set Environment Variables**
   
   In Vercel dashboard, add:
   ```
   JWT_SECRET=<generate-with-openssl-rand-base64-32>
   ADMIN_USERNAME=your-admin-email@domain.com
   ADMIN_PASSWORD=your-secure-password
   CRON_API_KEY=<optional-cron-security-key>
   SEED_SECRET_KEY=<optional-seed-security-key>
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Access deployment URL provided by Vercel

5. **Seed Database**
   
   After first deployment:
   ```bash
   curl "https://your-app.vercel.app/api/admin/seed?key=YOUR_SEED_SECRET_KEY"
   ```

6. **Set up Cron Jobs**
   
   Vercel Cron is already configured in `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/cron/fetch-feeds",
       "schedule": "*/30 * * * *"
     }]
   }
   ```

#### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes* | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `POSTGRES_URL` | Yes* | Vercel Postgres URL (auto-set) | `postgres://...` |
| `JWT_SECRET` | Yes | Secret for JWT signing (min 32 chars) | `openssl rand -base64 32` |
| `ADMIN_USERNAME` | No | Initial admin email | `admin@feedcentral.local` |
| `ADMIN_PASSWORD` | No | Initial admin password | `admin123` |
| `CRON_API_KEY` | No | Cron endpoint security key | `your-secret-key` |
| `SEED_SECRET_KEY` | No | Seed endpoint security key | `your-secret-key` |

*Use either `DATABASE_URL` or `POSTGRES_URL` (Vercel auto-provides the latter)

### Deploy to Other Platforms

FeedCentral can be deployed to any platform supporting Node.js and PostgreSQL:

- **Railway:** Connect GitHub repo, add PostgreSQL plugin
- **Render:** Create Web Service + PostgreSQL database
- **DigitalOcean:** App Platform with managed PostgreSQL
- **AWS:** Elastic Beanstalk + RDS PostgreSQL
- **Self-hosted:** Any VPS with Node.js 18+ and PostgreSQL 14+

#### General Deployment Steps

1. Set up PostgreSQL database
2. Configure environment variables
3. Build: `npm run build`
4. Run: `npm run start`
5. Seed database via API endpoint
6. Set up cron job to hit `/api/cron/fetch-feeds` every 30 minutes

### Production Checklist

- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET (min 32 characters)
- [ ] Configure secure database credentials
- [ ] Set up SSL/TLS certificates
- [ ] Enable CORS if needed
- [ ] Configure rate limiting
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure backup strategy for database
- [ ] Test cron job execution
- [ ] Verify analytics integration

📝 See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment guide.

## 🏗️ Project Structure

```
feedcentral/
├── app/                          # Next.js App Router
│   ├── (app)/                   # Main app route group
│   │   └── [category]/          # Dynamic category pages
│   ├── admin/                   # Admin panel
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── sources/             # RSS source management
│   │   ├── jobs/                # Feed job monitoring
│   │   ├── users/               # User management
│   │   └── settings/            # Admin settings
│   ├── api/                     # API routes
│   │   ├── articles/            # Article CRUD endpoints
│   │   ├── auth/                # Authentication (login, logout, me)
│   │   ├── bookmarks/           # Bookmark management
│   │   ├── search/              # Full-text search
│   │   ├── stats/               # Dashboard statistics
│   │   ├── sources/             # Public source listing
│   │   ├── admin/               # Admin API (sources, jobs, users, seed)
│   │   ├── cron/                # Cron job endpoints
│   │   └── user/                # User profile endpoints
│   ├── app/                     # User-facing app
│   │   ├── page.tsx             # Main feed dashboard
│   │   ├── bookmarks/           # Saved articles
│   │   ├── dashboard/           # User dashboard
│   │   └── settings/            # User preferences
│   ├── article/[id]/            # Article reader
│   ├── login/                   # Login page
│   ├── changelog/               # Changelog page
│   ├── privacy/                 # Privacy policy
│   ├── terms/                   # Terms of service
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   │   └── AddSourceDialog.tsx  # Add RSS source dialog
│   ├── analytics/               # Analytics wrappers
│   ├── changelog/               # Changelog notifications
│   ├── feed/                    # Feed display components
│   │   ├── FeedCard.tsx         # Article card
│   │   ├── FeedList.tsx         # Article list container
│   │   ├── FeedSkeleton.tsx     # Loading skeleton
│   │   └── EmptyState.tsx       # Empty state UI
│   ├── layout/                  # Layout components
│   │   ├── TopNav.tsx           # Top navigation bar
│   │   ├── SideNav.tsx          # Sidebar navigation
│   │   ├── AppTabs.tsx          # Category tabs
│   │   ├── AdminSideNav.tsx     # Admin sidebar
│   │   └── UserMenu.tsx         # User dropdown menu
│   ├── reader/                  # Article reader components
│   │   ├── ArticleHeader.tsx    # Article metadata header
│   │   └── ArticleContent.tsx   # Article content display
│   ├── search/                  # Search components
│   │   └── CommandSearch.tsx    # Cmd+K search palette
│   ├── theme/                   # Theme management
│   │   ├── ThemeProvider.tsx    # Theme context provider
│   │   └── ThemeToggle.tsx      # Dark/light mode toggle
│   ├── providers/               # React context providers
│   │   └── PreferencesProvider.tsx
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── toast.tsx
│       └── ...
│
├── lib/                         # Utilities and services
│   ├── auth.ts                  # Authentication utilities (verifyAuth, requireAuth, requireAdmin)
│   ├── prisma.ts                # Prisma client singleton
│   ├── rss-parser.ts            # RSS feed parser with normalization
│   ├── env.ts                   # Environment variable validation
│   ├── utils.ts                 # Helper functions (cn, formatters)
│   ├── decode-html.ts           # HTML entity decoder
│   ├── changelog-data.ts        # Changelog content
│   └── hooks/                   # Custom React hooks
│       ├── useAuth.tsx          # Auth context and hooks
│       └── useToast.ts          # Toast notifications
│
├── prisma/                      # Database
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # Seed script
│   ├── migrations/              # Database migrations
│   └── README.md                # Prisma documentation
│
├── scripts/                     # Build and utility scripts
│   ├── check-env.js             # Environment validation
│   ├── postbuild.js             # Post-build tasks
│   └── ...
│
├── docs/                        # Documentation
│   ├── QUICK_START.md           # 5-minute setup guide
│   ├── DEVELOPER_GUIDE.md       # Architecture and development
│   ├── ENVIRONMENT_SETUP.md     # Environment configuration
│   ├── DEPLOYMENT.md            # Deployment instructions
│   ├── IMPLEMENTATION_SUMMARY.md # Feature implementation status
│   └── ...
│
├── types/                       # TypeScript type definitions
│   └── index.ts
│
├── public/                      # Static assets
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Environment template
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── vercel.json                  # Vercel deployment config
└── README.md                    # This file
```

## 📚 Documentation

Comprehensive guides for developers, administrators, and contributors:

### Getting Started
- **[Quick Start Guide](docs/QUICK_START.md)** - Get running in 5 minutes
- **[Environment Setup](docs/ENVIRONMENT_SETUP.md)** - Detailed environment configuration for local and production
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Step-by-step Vercel deployment instructions

### Development
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Architecture, components, design system, and what's implemented
- **[Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)** - Complete feature list and implementation status
- **[UI/UX Specs](docs/UI_UX_Specs.md)** - Design specifications, animations, and interaction patterns
- **[Architecture Plan](docs/Plan_architecture.md)** - Original system architecture and design decisions

### Operations
- **[Cron Setup](docs/CRON_SETUP.md)** - Automated feed fetching configuration
- **[Scripts Reference](docs/SCRIPTS_REFERENCE.md)** - Available npm scripts and utilities
- **[Database Schema](prisma/README.md)** - Prisma schema documentation

### Additional Resources
- **[Changelog](app/changelog/page.tsx)** - Version history and updates
- **[Fixes Applied](docs/FIXES_APPLIED.md)** - Bug fixes and improvements log
- **[Optimization Summary](docs/OPTIMIZATION_SUMMARY.md)** - Performance optimizations

## 📜 Available Scripts

### Development

```bash
npm run dev              # Start development server at http://localhost:3000
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint and auto-fix issues
npm run type-check       # Run TypeScript compiler without emitting files
```

### Database Management

```bash
npm run check-env        # Validate environment configuration
npm run setup            # One-command setup (check-env + generate + push + seed)
npm run db:generate      # Generate Prisma client from schema
npm run db:push          # Push schema changes to database (dev)
npm run db:migrate       # Create and run migrations (production)
npm run db:seed          # Seed database with initial data
npm run db:studio        # Open Prisma Studio GUI for database management
npm run db:reset         # Reset database (DANGEROUS: deletes all data)
```

### Post-installation

```bash
npm run postinstall      # Automatically runs after npm install (generates Prisma client)
```

## 🌐 API Overview

FeedCentral provides a comprehensive RESTful API for articles, authentication, bookmarks, and admin operations.

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/articles` | GET | Fetch articles with pagination, category/source filtering |
| `/api/articles/[id]` | GET | Get single article by ID |
| `/api/search` | GET | Full-text search with PostgreSQL FTS and relevance ranking |
| `/api/stats` | GET | Dashboard statistics (total articles, sources, jobs) |
| `/api/sources` | GET | List all active RSS sources |

### Authentication Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/login` | POST | User login (returns JWT in httpOnly cookie) | No |
| `/api/auth/logout` | POST | User logout (clears auth cookie) | Yes |
| `/api/auth/me` | GET | Get current authenticated user | Yes |
| `/api/auth/register` | POST | Register new user account | No |

### User Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/bookmarks` | GET | Get user's bookmarks | Yes |
| `/api/bookmarks` | POST | Add article to bookmarks | Yes |
| `/api/bookmarks` | DELETE | Remove bookmark | Yes |
| `/api/user/profile` | GET | Get user profile | Yes |
| `/api/user/profile` | PUT | Update user profile | Yes |

### Admin Endpoints (ADMIN role required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/sources` | GET | List all RSS sources |
| `/api/admin/sources` | POST | Add new RSS source |
| `/api/admin/sources/[id]` | PUT | Update RSS source |
| `/api/admin/sources/[id]` | DELETE | Delete RSS source |
| `/api/admin/jobs` | GET | List feed job history |
| `/api/admin/users` | GET | List all users |
| `/api/admin/users` | POST | Create new user |
| `/api/admin/users/[id]` | PUT | Update user |
| `/api/admin/users/[id]` | DELETE | Delete user |
| `/api/admin/seed` | GET | Seed database (requires SEED_SECRET_KEY) |

### Cron Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/cron/fetch-feeds` | GET/POST | Trigger RSS feed fetch job | CRON_API_KEY or Vercel Cron secret |

### Response Format

All API endpoints return JSON with a consistent structure:

```json
{
  "success": true,
  "data": { /* response data */ },
  "error": "Error message (only if success: false)"
}
```

### Authentication

Protected endpoints require a JWT token sent via:
- **Cookie:** `auth_token` (httpOnly, secure in production)
- **Header:** `Authorization: Bearer <token>`

Token validity: 7 days

## 🎨 Design Philosophy

FeedCentral follows a **Vercel-inspired design system** focused on clarity, professionalism, and user respect.

### Design Principles

- **Minimal:** No unnecessary elements or distractions
- **Elegant:** Subtle animations and generous spacing
- **Professional:** Clean, polished, and trustworthy
- **Dark-first:** Optimized for low-light reading environments
- **Accessible:** WCAG AA/AAA compliant with keyboard navigation

### Visual Identity

| Element | Specification |
|---------|---------------|
| **Primary Color** | `#7C5CFF` (violet) |
| **Background (dark)** | `#0a0a0a` |
| **Card Background** | `#121212` |
| **Border (glass)** | `rgba(255, 255, 255, 0.08)` |
| **Typography** | Geist Sans, Geist Mono |
| **Border Radius** | 8-12px (rounded corners) |
| **Spacing** | 8px scale (8, 12, 16, 24, 32) |
| **Animations** | 150-300ms with Vercel easing curve |

### Animation Guidelines

- **Duration:** 150-300ms maximum
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Vercel curve)
- **Stagger:** 30ms delay for list items
- **Spring Animations:** Stiffness 380-500, damping 30-40
- **Accessibility:** Respects `prefers-reduced-motion`

### Component Conventions

- **File Naming:** PascalCase (e.g., `FeedCard.tsx`)
- **Client Components:** Mark with `'use client'` directive
- **Server Components:** Default (no directive needed)
- **Props Interfaces:** Named `ComponentNameProps`
- **Exports:** Named exports preferred

---

## 🧪 Testing & Quality

### Code Quality Tools

- **ESLint:** Next.js configuration with strict rules
- **TypeScript:** Strict mode enabled
- **Prettier:** (Recommended to add)

### Run Checks

```bash
npm run lint              # Check for linting errors
npm run lint:fix          # Auto-fix linting issues
npm run type-check        # TypeScript compilation check
```

### Database Tools

```bash
npm run db:studio         # Open Prisma Studio for database inspection
```

---

## 🔧 Troubleshooting

### Common Issues

#### Environment Variables Not Loaded

```bash
# Verify environment variables
npm run check-env

# Ensure .env file exists
cp .env.example .env
```

#### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
# Test connection with Prisma
npm run db:studio
```

#### Prisma Client Not Generated

```bash
# Regenerate Prisma client
npm run db:generate

# Or reinstall dependencies (triggers postinstall)
npm install
```

#### Seed Data Not Loading

```bash
# Run seed script directly
npm run db:seed

# Or via API endpoint (if deployed)
curl "http://localhost:3000/api/admin/seed?key=YOUR_SEED_SECRET_KEY"
```

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

#### Cron Jobs Not Running

- **Local Development:** Cron jobs don't run automatically. Trigger manually:
  ```bash
  curl -X POST http://localhost:3000/api/cron/fetch-feeds \
    -H "Authorization: Bearer YOUR_CRON_API_KEY"
  ```

- **Vercel:** Check cron configuration in `vercel.json` and deployment logs

### Getting Help

If you encounter issues:

1. Check [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for common pitfalls
2. Search [GitHub Issues](https://github.com/BENZOOgataga/feedcentral/issues)
3. Open a new issue with:
   - Environment details (OS, Node version, database)
   - Error messages and logs
   - Steps to reproduce

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, documentation improvements, or design enhancements.

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/BENZOOgataga/feedcentral.git
   cd feedcentral
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style and conventions
   - Add tests if applicable
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new feature description"
   ```
   
   Use conventional commits:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Contribution Guidelines

- Read the [Developer Guide](docs/DEVELOPER_GUIDE.md) to understand the architecture
- Follow the [Design Philosophy](#-design-philosophy) for UI/UX changes
- Ensure your code passes linting and type checks
- Write clear, descriptive commit messages
- Update relevant documentation
- Be respectful and constructive in discussions

### Areas We Need Help

- 🎨 UI/UX improvements and accessibility enhancements
- 🐛 Bug fixes and error handling
- 📝 Documentation and tutorials
- 🌐 Internationalization (i18n) support
- 🧪 Test coverage improvements
- 🚀 Performance optimizations
- 📱 Mobile experience enhancements

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 FeedCentral

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Open Source Projects

FeedCentral is built on the shoulders of giants. Special thanks to:

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Vercel](https://vercel.com/)** - Deployment platform and design inspiration
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautifully designed components
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide](https://lucide.dev/)** - Beautiful icon set
- **[PostgreSQL](https://www.postgresql.org/)** - Powerful open-source database

### Design Inspiration

- **[Vercel Dashboard](https://vercel.com/dashboard)** - For the clean, professional design system
- **[Linear](https://linear.app/)** - For interaction patterns and micro-animations
- **[Raindrop.io](https://raindrop.io/)** - For bookmark organization concepts

### Community

Thanks to all contributors who have helped make FeedCentral better!

---

## 📞 Contact & Support

### Official Links

- **Live Instance:** [feed.benzoogataga.com](https://feed.benzoogataga.com)
- **GitHub Repository:** [BENZOOgataga/feedcentral](https://github.com/BENZOOgataga/feedcentral)
- **Issues & Bug Reports:** [GitHub Issues](https://github.com/BENZOOgataga/feedcentral/issues)
- **Discussions:** [GitHub Discussions](https://github.com/BENZOOgataga/feedcentral/discussions)

### Support the Project

If you find FeedCentral useful, consider supporting its development:

- ⭐ **Star the repository** on GitHub
- 💖 **[Support on Patreon](https://www.patreon.com/BENZOOgataga)**
- 🐛 Report bugs and suggest features
- 📝 Contribute code or documentation
- 🌐 Share FeedCentral with others

### Contact

- **Email:** contact@benzoogataga.com
- **Maintainer:** [@BENZOOgataga](https://github.com/BENZOOgataga)

---

## 🔒 Privacy & Ethics

FeedCentral is built with privacy and user respect at its core:

- ✅ **No tracking** - We don't use analytics cookies or tracking scripts
- ✅ **No ads** - Zero advertising, ever
- ✅ **No data selling** - Your reading habits are yours alone
- ✅ **GDPR compliant** - Operated from France with full GDPR compliance
- ✅ **Open source** - Full transparency, audit the code yourself
- ✅ **Self-hostable** - Run your own instance with complete control

Read our [Privacy Policy](app/privacy/page.tsx) and [Terms of Service](app/terms/page.tsx) for details.

---

<div align="center">

**Built with ❤️ for the open web**

Take back control of your news feed.

[Get Started](#-getting-started) • [Documentation](#-documentation) • [Contribute](#-contributing)

</div>
