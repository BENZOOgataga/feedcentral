# FeedCentral - Developer Guide

## Project Overview

FeedCentral is a **professional RSS feed aggregator** built with Next.js 14, designed to centralize news from verified sources with a clean, Vercel-like interface. The project aims to provide a stable, reliable, and elegant news reading experience without distractions.

**Current Status:** Frontend foundation complete, backend integration pending.

---

## What Has Been Built

### ✅ Infrastructure & Setup

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS v4** with custom design tokens
- **shadcn/ui** component library integrated
- **Framer Motion** for animations
- **next-themes** for dark/light theme switching (dark-first)
- **Vercel Analytics** and **Speed Insights** integrated
- Production build verified and working

### ✅ Design System

**Reference:** The design is inspired by **Vercel's dashboard** — clean, modern, professional, with subtle animations and consistent spacing.

#### Color Palette
- **Primary accent:** `#7C5CFF` (violet)
- **Background (dark):** `#0a0a0a`
- **Card background:** `#121212`
- **Border (glass effect):** `rgba(255, 255, 255, 0.08)`
- **Muted text:** `#a1a1a1`

#### Design Tokens
- **Spacing scale:** 8px, 12px, 16px, 24px, 32px
- **Border radius:** 8px (sm), 10px (md), 12px (lg)
- **Shadows:** Subtle and diffused, accent shadows on hover
- **Animation easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Vercel-like)
- **Typography:** Geist Sans and Geist Mono fonts

#### Key Interactions (Vercel-style)
- **Hover lift:** Cards translate -2px with shadow
- **Button hover:** Scale 1.02, subtle shadow
- **Button active:** Scale 0.98
- **Focus states:** Ring with primary color
- **Stagger animations:** Feed items fade-in-up with 30ms delay
- **Spring animations:** Sidebar active indicator, tab underline
- **Cmd+K palette:** Scale-in from 0.95 with backdrop blur

### ✅ Components Built

#### Layout Components
- **TopNav:** Fixed header with logo, search bar (Cmd+K trigger), theme toggle, user menu
- **SideNav:** Icon-based navigation with animated active indicator (spring motion)
- **AppTabs:** Horizontal category tabs with animated underline (layoutId)

#### Feed Components
- **FeedCard:** Article card with image, title, description, metadata, hover animations
- **FeedList:** Container for staggered feed card animations
- **FeedSkeleton:** Loading placeholder with pulse animation
- **EmptyState:** No results state with CTA button

#### Reader Components
- **ArticleHeader:** Article metadata, title, author, external link button
- **ArticleContent:** Clean, readable article content display

#### Search
- **CommandSearch:** Cmd+K search palette with keyboard navigation (↑↓ Enter), backdrop blur, animated appearance

#### Theme
- **ThemeProvider:** next-themes wrapper with dark-first approach
- **ThemeToggle:** Smooth icon transition between sun/moon

#### Analytics
- **VercelAnalytics:** Wrapper for @vercel/analytics
- **SpeedInsights:** Wrapper for @vercel/speed-insights

### ✅ Pages Built

1. **Landing Page (`/`)**: Hero, features, trusted sources, footer
2. **App Dashboard (`/app`)**: Main feed with category tabs, empty state
3. **Article Reader (`/article/[id]`)**: Full article view with back button, slide-in animation
4. **Admin Panel (`/admin`)**: Dashboard with links to sources, jobs, users, settings management

### ✅ API Routes (Placeholders)

- `/api/articles` - GET articles with pagination and filters
- `/api/stats` - GET dashboard statistics
- `/api/search` - GET search results by query

**Note:** All API routes return mock data and need backend integration.

---

## What Is Missing / TODO

### ❌ Backend Integration

**Priority: CRITICAL**

1. **Database Setup**
   - Choose database (PostgreSQL recommended)
   - Create schema for articles, sources, categories, users, jobs
   - Implement ORM (Prisma or Drizzle)
   - Run migrations (see `migrations/` folder placeholders in original plan)

2. **RSS Feed Parser**
   - Implement RSS/Atom feed fetching logic
   - Parse and normalize feed data
   - Store articles in database
   - Handle duplicates and updates

3. **CRON Jobs**
   - Schedule automatic feed refresh (every 15-30 minutes)
   - Track job status (pending, running, completed, failed)
   - Log errors and failed fetches

4. **API Implementation**
   - Replace mock data in `/api/articles/route.ts`
   - Implement actual database queries
   - Add pagination logic
   - Add filtering by category, source, date
   - Implement full-text search in `/api/search/route.ts`
   - Add authentication middleware

### ❌ Authentication System

**Priority: HIGH**

1. **JWT Authentication**
   - Implement login/logout endpoints (`/api/auth/login`, `/api/auth/logout`)
   - Session management
   - Token refresh logic
   - Secure cookie handling

2. **User Management**
   - User registration (if needed)
   - Password hashing (bcrypt)
   - Role-based access control (admin, user)
   - Protected routes middleware

3. **UI Integration**
   - Login page (`/login`)
   - User profile menu in TopNav
   - Protected route wrappers for `/admin` and `/app`

### ❌ Missing Pages

1. **Category Pages** (`/app/[category]`)
   - Currently only `/app` exists
   - Need dynamic routes for tech, science, business, etc.
   - Filter articles by category

2. **Admin Subpages**
   - `/admin/sources` - Manage RSS sources (add, edit, delete, toggle active)
   - `/admin/jobs` - View feed refresh jobs and logs
   - `/admin/users` - Manage user accounts
   - `/admin/settings` - Global app settings

3. **User Pages**
   - `/app/bookmarks` - Saved/favorited articles
   - `/app/dashboard` - Personal stats (mentioned in SideNav but not built)
   - `/app/settings` - User preferences

4. **Error Pages**
   - Custom 404 page
   - Custom 500 page
   - Better error boundaries

### ❌ Missing Features

1. **Search Functionality**
   - CommandSearch component exists but has no backend
   - Connect to `/api/search` route
   - Implement debounced search queries
   - Add search history/suggestions

2. **Article Interactions**
   - Mark as read/unread
   - Bookmark/favorite toggle
   - Share functionality
   - Open in new tab option

3. **Feed Management**
   - Add new RSS sources (user-facing or admin-only)
   - Subscribe/unsubscribe to categories
   - Source status indicators (active, error, last updated)

4. **Pagination**
   - Infinite scroll or page-based pagination
   - "Load more" button
   - Scroll position persistence

5. **Filtering & Sorting**
   - Sort by date, relevance, source
   - Filter by date range
   - Filter by read/unread status

6. **Mobile Navigation**
   - Bottom nav bar for mobile
   - Drawer/sheet for mobile SideNav
   - Improved responsive behavior

7. **Notifications**
   - Toast notifications for actions (refresh, save, error)
   - Real-time updates indicator

8. **Settings Panel**
   - Feed refresh interval
   - Default view preferences
   - Notification preferences
   - Data export

### ❌ Known Issues / Bugs

1. **Route Conflicts**
   - Original plan had `(landing)` and `(app)` route groups
   - Currently landing is at `/` and app at `/app`
   - May need restructuring if both `/` and `/app` should show different layouts

2. **Article Page**
   - Always shows "Article not found" because no data fetching is implemented
   - Need to connect to `/api/articles/[id]` endpoint

3. **CommandSearch**
   - Opens but shows no results (no backend)
   - Keyboard navigation works but has no items to navigate

4. **Empty States Everywhere**
   - Dashboard shows empty state because no articles are fetched
   - All pages with data show placeholders

5. **Image Handling**
   - FeedCard expects `imageUrl` but no fallback if missing
   - Need placeholder images or better null handling

6. **TypeScript Warnings**
   - Some `any` types may exist
   - Some unused imports
   - Run `npm run lint` to check

### ❌ Performance Optimizations

1. **Virtualization**
   - Long article lists should use react-window or similar
   - Mentioned in architecture plan but not implemented

2. **Image Optimization**
   - Use Next.js Image component everywhere
   - Add image CDN or optimization service

3. **Code Splitting**
   - Dynamic imports for heavy components
   - Lazy load admin panel components

4. **Caching**
   - Implement SWR or React Query for data fetching
   - Cache API responses
   - ISR for static content

---

## Design Guidelines for Future Developers

### Visual Identity

FeedCentral should feel like a **tool of truth** — stable, clear, and trustworthy. The design language is:

- **Minimal:** No unnecessary elements
- **Elegant:** Subtle animations, generous spacing
- **Vercel-inspired:** Professional, polished, modern
- **Dark-first:** Optimized for low-light environments
- **Accessible:** AA/AAA contrast, keyboard navigation, screen reader support

### Animation Rules

- **Duration:** 150-300ms max
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Vercel curve)
- **Respect `prefers-reduced-motion`:** Disable non-essential animations
- **Stagger delays:** 30ms for list items
- **Spring animations:** Use for active indicators (stiffness: 380-500, damping: 30-40)

### Component Conventions

- **File naming:** PascalCase (e.g., `FeedCard.tsx`)
- **Props interfaces:** Named `ComponentNameProps`
- **Client components:** Mark with `'use client'` at top
- **Server components:** Default, no directive needed
- **Exports:** Named exports preferred, default for pages

### Code Quality

- **No duplication:** Extract reusable logic to `lib/`
- **Type everything:** Avoid `any`, use `unknown` if needed
- **Accessibility:** Always include ARIA labels, focus states, keyboard nav
- **Comments:** Explain *why*, not *what*

---

## Tech Stack Reference

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide React |
| Theme | next-themes |
| Analytics | @vercel/analytics, @vercel/speed-insights |
| Fonts | Geist Sans, Geist Mono |

---

## Getting Started (for New Developers)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Check for errors:**
   ```bash
   npm run lint
   ```

5. **Review design specs:**
   - Read `Prompt.md` for project vision
   - Read `Plan d'architecture.md` for structure
   - Read `UI_UX_Specs.md` for interaction details

---

## Next Steps (Recommended Order)

1. **Set up database** (PostgreSQL + Prisma)
2. **Implement RSS parser** and seed with test sources
3. **Build `/api/articles` endpoint** with real data
4. **Connect dashboard to API** and display articles
5. **Implement authentication** (JWT + login page)
6. **Build admin pages** (sources, jobs, users)
7. **Add search functionality**
8. **Implement bookmarks and read tracking**
9. **Add pagination and filtering**
10. **Polish mobile experience**
11. **Add tests** (Jest + React Testing Library)
12. **Deploy to Vercel**

---

## Questions or Issues?

Refer to original specs:
- `Prompt.md` - Full project brief
- `Plan d'architecture.md` - Architecture details
- `UI_UX_Specs.md` - Design and interaction specs

For design decisions, always reference **Vercel's dashboard** as the north star.
