# FeedCentral - Exhaustive Project Documentation

## Project Overview

FeedCentral is a production-grade, professional RSS aggregator platform built with Next.js 14, designed to aggregate, normalize, and display content from 30+ trusted RSS sources across 8 curated categories. The platform features a premium dark-first UI inspired by Apple, Adobe Creative Cloud, and Vercel's design systems.

---

## Technical Architecture

### Frontend Stack
- Framework: Next.js 14 (App Router, React 18, TypeScript)
- Styling: Tailwind CSS with custom design system
- Animations: Framer Motion (spring physics, stagger animations)
- Icons: Lucide React
- Theme Management: next-themes (dark/light toggle)
- UI Components: Custom-built (Radix UI primitives)
- Font: Inter (Google Fonts, -apple-system fallback)

### Backend Stack
- Database: Neon Serverless Postgres (via Vercel integration)
- Authentication: JWT with httpOnly cookies, bcrypt password hashing
- API: Next.js API Routes (REST)
- RSS Parsing: Custom parser with retry logic, timeout handling
- Validation: Zod schemas
- Rate Limiting: Middleware
- Cron Jobs: Self-hosted bash script (15-minute intervals)

### Deployment
- Platform: Vercel (production + preview)
- Database: Neon Postgres
- Repository: GitHub (BENZOOgataga/feedcentral)
- Domain: feed.benzoogataga.com (custom domain ready)

---

## Database Schema

### Tables

1) users
```
- id: UUID (primary key)
- username: VARCHAR(255) UNIQUE NOT NULL
- password_hash: VARCHAR(255) NOT NULL
- created_at: TIMESTAMP DEFAULT NOW()
```

2) sources
```
- id: UUID (primary key)
- name: VARCHAR(255) NOT NULL
- url: TEXT NOT NULL
- category: VARCHAR(100) NOT NULL
- active: BOOLEAN DEFAULT true
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()
```

3) articles
```
- id: UUID (primary key)
- source_id: UUID (foreign key → sources)
- title: TEXT NOT NULL
- description: TEXT
- url: TEXT NOT NULL UNIQUE
- pub_date: TIMESTAMP NOT NULL
- category: VARCHAR(100) NOT NULL
- source_name: VARCHAR(255) NOT NULL
- image_url: TEXT
- content: TEXT
- author: VARCHAR(255)
- guid: TEXT
- created_at: TIMESTAMP DEFAULT NOW()
- search_vector: tsvector (full-text search index)
```

4) metadata
```
- key: VARCHAR(255) PRIMARY KEY
- value: TEXT NOT NULL
- updated_at: TIMESTAMP DEFAULT NOW()
```

### Indexes
- idx_articles_pub_date (pub_date DESC)
- idx_articles_category (category)
- idx_articles_source_id (source_id)
- idx_articles_search (GIN index on search_vector)

### Triggers
- Auto-update search_vector on article insert/update
- Auto-cleanup articles older than 90 days

---

## RSS Sources (30+ feeds across 8 categories)

- Technology (4): TechCrunch, The Verge, Ars Technica, Wired
- Cybersecurity (3): Krebs on Security, Threatpost, Dark Reading
- World News (3): Reuters World, BBC News, Al Jazeera
- Business & Finance (3): Bloomberg, Financial Times, WSJ Tech
- Science (3): Scientific American, Nature News, Science Daily
- Programming (3): Hacker News, Dev.to, GitHub Blog
- Infrastructure & DevOps (3): Docker Blog, Kubernetes Blog, AWS News
- AI & Machine Learning (3): OpenAI Blog, Google AI Blog, DeepMind Blog

---

## API Endpoints

### Public
- GET /api/articles
  - Params: page, limit, search, category
  - Returns: `{ items: Article[], total, page, total_pages }`
- GET /api/stats → totals, categories, last_updated

### Auth (JWT)
- POST /api/auth/login → sets httpOnly cookie
- POST /api/auth/logout → clears cookie
- POST /api/auth/change-password

### Sources (protected)
- GET /api/sources
- POST /api/sources
- PUT /api/sources/[id]
- DELETE /api/sources/[id]

### Maintenance
- POST /api/refresh-feeds (requires CRON_API_KEY)

---

## Design System

### Colors (Dark Mode - Primary)
- Background: `hsl(224,71%,4%)`
- Foreground: `hsl(213,31%,91%)`
- Card: `hsl(224,71%,4%)`
- Primary: `hsl(263,70%,60%)` (#7C5CFF)
- Secondary: `hsl(215,28%,17%)`
- Muted: `hsl(223,47%,11%)`
- Accent: `hsl(216,34%,17%)`

### Opacity Layers
- white/[0.02] backgrounds
- white/[0.03] glass base
- white/[0.04] hover
- white/[0.05] glass strong
- white/[0.06] borders
- white/[0.08] elevated borders
- white/[0.12] hover borders
- white/[0.40] muted text
- white/[0.60] secondary text

### Typography
- Family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
- Sizes: 11px (meta), 13px (body), 15px (titles), 20px (headers), 24px (logo)
- Weights: 400, 500, 600, 700
- Tracking: tight for headers, wide for labels

### Spacing
- 8 / 12 / 16 / 24 / 32 / 48 / 64 px scale

### Radius
- rounded-lg (0.5rem), rounded-xl (0.75rem), rounded-full

### Shadows
- Soft: `0 2px 8px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
- Elevated: `0 4px 16px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)`
- Float: `0 8px 32px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.12)`
- Glass (Adobe CC): inset + deep drop shadows

### Glassmorphism
- Standard: `background: rgba(255,255,255,0.03); backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255,255,255,0.06);`
- Strong: `rgba(255,255,255,0.05)`, blur(32px), border(0.08)

---

## Component Architecture

### Layout
- Sidebar (280px fixed): glass, animated active indicator (Framer Motion), icons with scale hover
- Header (72px): sticky, Apple-style search, theme toggle, precise typography

### Feed
- FeedItem: hover lift, glass card, badge uppercase 11px, relative time, footer with link animation
- EmptyState: centered minimal design

### UI Primitives
- Button: variants (default/secondary/ghost/etc.), hover lift, active scale, focus ring
- Card: glass-strong, nested border, elevated shadow
- Input: Apple-style focus ring
- Badge: variants, rounded-full
- Skeleton: pulse animation

---

## Animations & Transitions

### Framer Motion
- Sidebar indicator: `spring { stiffness: 400, damping: 35 }`
- FeedItem: staggered fade-in-up with `[0.16,1,0.3,1]`

### CSS
- Smooth: `transition: all 0.2s cubic-bezier(0.4,0,0.2,1)`
- Smooth long: `0.3s cubic-bezier(0.16,1,0.3,1)`
- Hover effects: lift, shadow increase, icon scale, link nudge

---

## File Structure
```
feedcentral/
├─ app/
│  ├─ layout.tsx          # Root layout with Sidebar + ThemeProvider
│  ├─ page.tsx            # Dashboard (dynamic rendering)
│  ├─ globals.css         # Design system + utilities
│  ├─ feed/
│  │  └─ page.tsx         # Legacy feed page (static)
│  └─ api/
│     ├─ articles/route.ts
│     ├─ sources/route.ts
│     ├─ sources/[id]/route.ts
│     ├─ stats/route.ts
│     ├─ refresh-feeds/route.ts
│     └─ auth/
│        ├─ login/route.ts
│        ├─ logout/route.ts
│        └─ change-password/route.ts
├─ components/
│  ├─ ui/
│  │  ├─ button.tsx
│  │  ├─ card.tsx
│  │  ├─ input.tsx
│  │  ├─ badge.tsx
│  │  └─ skeleton.tsx
│  ├─ layout/
│  │  ├─ sidebar.tsx
│  │  └─ header.tsx
│  ├─ feed/
│  │  ├─ feed-item.tsx
│  │  └─ empty-state.tsx
│  ├─ theme-provider.tsx
│  └─ theme-toggle.tsx
├─ lib/
│  ├─ utils.ts            # cn(), formatDate(), formatRelativeTime()
│  ├─ db.ts               # Neon Postgres connection (planned)
│  └─ auth.ts             # JWT utilities (planned)
├─ config/
│  └─ rss-sources.ts      # 30+ RSS feed URLs
├─ migrations/
│  ├─ 001_init.sql
│  ├─ 001_init_simple.sql
│  └─ 002_add_trigger.sql
├─ scripts/
│  └─ refresh-feeds.sh    # Cron script (15min intervals)
├─ types/
│  └─ index.ts            # TypeScript interfaces
```

---

## Deployment & Env Vars
- DATABASE_URL (Neon Postgres)
- JWT_SECRET
- ADMIN_USERNAME
- ADMIN_PASSWORD_HASH
- CRON_API_KEY
- NEXT_PUBLIC_SITE_URL
- CORS_ORIGIN

---

## Definition of Done (DoD)
- Build passes with no base warnings
- Dark mode exemplary; light via toggle works
- Pages responsive and accessible (ARIA, keyboard nav)
- Buttons/menus animations smooth (no stutter)
- Code modular, explicit names, no antipatterns
