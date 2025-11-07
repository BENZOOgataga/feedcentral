# Custom RSS Sources - Confirmed Feature

> **Status**: 🎯 **Top Priority - Next to Implement**  
> **Target Release**: December 2025  
> **Type**: Core Feature - Personalization

## 📖 Overview

**Custom RSS Sources** is our highest priority confirmed feature that will allow authenticated users to add their own personal RSS feeds to FeedCentral, creating a truly personalized news aggregation experience. Users will be able to follow sources they value while optionally hiding default sources.

This feature represents a strategic shift from a curated aggregator to a fully personalized news platform with built-in monetization through premium tiers.

---

## 🎯 Goals

### User Goals
- Follow niche blogs, podcasts, and sources not in default catalog
- Personalize their feed based on interests
- Control which sources appear in their feed
- Build a curated reading list

### Business Goals
- **Strong account creation incentive** (custom sources = premium feature)
- User retention through personalized content
- Foundation for future premium tiers
- Differentiation from static RSS readers

---

## 🎨 User Experience Flow

### Discovery & Addition

```
┌─────────────────────────────────────────────────────────────┐
│  App Feed Page (Authenticated User)                         │
├─────────────────────────────────────────────────────────────┤
│  [Your Feed ▼]  [All]  [Technology]  [+Add Source]         │
│                                                              │
│  Your Feed dropdown:                                         │
│  ✓ Show default sources (13 active)                        │
│  ✓ Show my custom sources (3 added)                        │
│    Manage Sources →                                          │
└─────────────────────────────────────────────────────────────┘

Click [+Add Source] or [Manage Sources]
         ↓

┌─────────────────────────────────────────────────────────────┐
│  My Sources                                   [+Add Source]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Your Custom Sources (3/10 used)                            │
│  ────────────────────────────────────────────              │
│                                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │ 📰 My Dev Blog                         [⚙️] │          │
│  │ https://mydevblog.com/feed               [❌] │          │
│  │ 24 articles • Updated 2 hours ago           │          │
│  │ ✓ Enabled in feed                            │          │
│  └──────────────────────────────────────────────┘          │
│                                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │ 🎙️ Tech Podcast                       [⚙️] │          │
│  │ https://techpodcast.fm/rss               [❌] │          │
│  │ 12 episodes • Updated yesterday              │          │
│  │ ⚪ Disabled in feed                          │          │
│  └──────────────────────────────────────────────┘          │
│                                                              │
│  Default Sources (13 available)                             │
│  ────────────────────────────────────────────              │
│  ✓ TechCrunch                                               │
│  ✓ The Verge                                                │
│  ⚪ Hacker News (hidden)                                    │
│  ...                                                         │
└─────────────────────────────────────────────────────────────┘

Click [+Add Source]
         ↓

┌─────────────────────────────────────────────────────────────┐
│  Add Custom RSS Source                          [✕ Close]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  RSS Feed URL *                                              │
│  ┌────────────────────────────────────────────────┐        │
│  │ https://example.com/feed.xml              [🔍] │        │
│  └────────────────────────────────────────────────┘        │
│  Paste the RSS or Atom feed URL                             │
│                                                              │
│  Custom Name (Optional)                                      │
│  ┌────────────────────────────────────────────────┐        │
│  │ My Favorite Tech Blog                          │        │
│  └────────────────────────────────────────────────┘        │
│  Leave empty to use feed's default name                     │
│                                                              │
│  [Preview Feed]  or  [Validate & Add]                      │
│                                                              │
│  ℹ️ Free tier: 10 custom sources maximum                   │
│  💎 Premium: Unlimited sources (coming soon)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### New Models

```prisma
// User's personal RSS source subscription
model UserSource {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Custom feed details
  feedUrl         String    // The RSS/Atom feed URL
  customName      String?   // User's custom name (overrides feed title)
  
  // Feed metadata (fetched from RSS)
  feedTitle       String?   // Original feed title
  feedDescription String?   @db.Text
  siteUrl         String?   // Website URL
  logoUrl         String?   // Feed logo/icon
  
  // User preferences
  isEnabled       Boolean   @default(true)  // Show in feed or not
  categoryId      String?   // Optional category assignment
  category        Category? @relation(fields: [categoryId], references: [id])
  
  // Feed status
  lastFetchedAt   DateTime?
  lastFetchError  String?   @db.Text
  fetchAttempts   Int       @default(0)
  isValid         Boolean   @default(true)  // False if feed consistently fails
  
  // Article tracking
  articleCount    Int       @default(0)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // User can only add each feed URL once
  @@unique([userId, feedUrl])
  @@index([userId])
  @@index([isEnabled])
}

// User's preference for default sources
model UserSourcePreference {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  sourceId        String    // Default source ID
  source          Source    @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  
  isEnabled       Boolean   @default(true)  // Show in feed or not
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // User can only have one preference per source
  @@unique([userId, sourceId])
  @@index([userId])
}

// Track articles from user sources (extends Article model)
model UserArticle {
  id              String    @id @default(cuid())
  
  // Article content (similar to Article model)
  title           String
  url             String
  excerpt         String?   @db.Text
  imageUrl        String?
  author          String?
  publishedAt     DateTime
  
  // Link to user source
  userSourceId    String
  userSource      UserSource @relation(fields: [userSourceId], references: [id], onDelete: Cascade)
  
  // Link to user (for easier querying)
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Bookmarks (reuse existing Bookmark model)
  bookmarks       Bookmark[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime? // Soft delete
  
  @@index([userSourceId])
  @@index([userId])
  @@index([publishedAt(sort: Desc)])
  @@index([deletedAt])
}
```

### Update User Model

```prisma
model User {
  id                      String                  @id @default(cuid())
  email                   String                  @unique
  name                    String
  password                String
  isAdmin                 Boolean                 @default(false)
  
  // Existing relations
  bookmarks               Bookmark[]
  
  // NEW: Custom sources
  userSources             UserSource[]
  userSourcePreferences   UserSourcePreference[]
  userArticles            UserArticle[]
  
  // NEW: Premium tier (for future)
  premiumTier             String?                 @default("free") // "free" | "premium" | "pro"
  premiumExpiresAt        DateTime?
  
  createdAt               DateTime                @default(now())
  updatedAt               DateTime                @updatedAt
  
  @@index([email])
}
```

---

## 🔧 API Endpoints

### User Sources Management

```typescript
// GET /api/user/sources
// Get all user's custom sources
Response: {
  sources: UserSource[]
  usage: {
    current: 3,
    limit: 10,
    canAddMore: true
  }
}

// POST /api/user/sources
// Add new custom source
Request: {
  feedUrl: string
  customName?: string
  categoryId?: string
}
Response: {
  source: UserSource
  validation: {
    isValid: boolean
    feedTitle: string
    articleCount: number
    errors?: string[]
  }
}

// PATCH /api/user/sources/[id]
// Update source settings
Request: {
  customName?: string
  isEnabled?: boolean
  categoryId?: string
}

// DELETE /api/user/sources/[id]
// Remove custom source

// POST /api/user/sources/[id]/refresh
// Manually refresh a source's feed
```

### Source Preferences (Default Sources)

```typescript
// GET /api/user/source-preferences
// Get user's preferences for default sources
Response: {
  preferences: {
    sourceId: string
    isEnabled: boolean
  }[]
}

// PATCH /api/user/source-preferences
// Bulk update preferences
Request: {
  preferences: {
    sourceId: string
    isEnabled: boolean
  }[]
}
```

### Unified Feed API

```typescript
// GET /api/articles?view=personalized
// Get articles from enabled sources (default + custom)
// Respects user's source preferences

Query params:
- view: "all" | "personalized" | "custom-only" | "default-only"
- category: string
- page: number
- pageSize: number
```

---

## 🎨 UI Components

### 1. Source Management Page

**Location**: `/app/sources/my-sources`

```tsx
// components/sources/MySourcesManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Settings, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export function MySourcesManager() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>My Sources</h1>
          <p className="text-muted-foreground">
            Manage your custom RSS feeds and default source preferences
          </p>
        </div>
        <Button onClick={openAddSourceDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Source
        </Button>
      </div>

      {/* Usage Stats */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Custom Sources</p>
            <p className="text-2xl font-bold">{usage.current} / {usage.limit}</p>
          </div>
          {!user.isPremium && (
            <Button variant="outline" onClick={showPremiumModal}>
              💎 Upgrade for Unlimited
            </Button>
          )}
        </div>
      </div>

      {/* Custom Sources List */}
      <section>
        <h2>Your Custom Sources</h2>
        <div className="space-y-4">
          {customSources.map(source => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </section>

      {/* Default Sources Preferences */}
      <section className="mt-12">
        <h2>Default Sources</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Toggle which default sources appear in your feed
        </p>
        <div className="grid gap-3">
          {defaultSources.map(source => (
            <DefaultSourceToggle key={source.id} source={source} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

### 2. Add Source Dialog

```tsx
// components/sources/AddSourceDialog.tsx
'use client';

export function AddSourceDialog({ open, onClose }) {
  const [feedUrl, setFeedUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState(null);

  async function validateFeed() {
    setIsValidating(true);
    const result = await fetch('/api/user/sources/validate', {
      method: 'POST',
      body: JSON.stringify({ feedUrl }),
    });
    const data = await result.json();
    setValidation(data);
    setIsValidating(false);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom RSS Source</DialogTitle>
          <DialogDescription>
            Add any RSS or Atom feed to your personal collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Feed URL Input */}
          <div>
            <Label>RSS Feed URL *</Label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/feed.xml"
                value={feedUrl}
                onChange={(e) => setFeedUrl(e.target.value)}
              />
              <Button onClick={validateFeed} disabled={isValidating}>
                {isValidating ? 'Checking...' : 'Validate'}
              </Button>
            </div>
          </div>

          {/* Validation Result */}
          {validation && (
            <div className={`p-4 rounded-lg ${
              validation.isValid ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}>
              {validation.isValid ? (
                <div>
                  <p className="font-semibold text-green-600">✓ Valid Feed</p>
                  <p className="text-sm">Found {validation.articleCount} articles</p>
                  <p className="text-sm">Title: {validation.feedTitle}</p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-red-600">✗ Invalid Feed</p>
                  <p className="text-sm">{validation.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Custom Name */}
          <div>
            <Label>Custom Name (Optional)</Label>
            <Input
              placeholder="Leave empty to use feed's name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>

          {/* Tier Limit Info */}
          {!user.isPremium && usage.current >= usage.limit && (
            <Alert>
              <AlertDescription>
                You've reached the free tier limit of {usage.limit} sources.
                <Link href="/premium">Upgrade to Premium</Link> for unlimited sources.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleAddSource}
            disabled={!validation?.isValid || usage.current >= usage.limit}
          >
            Add Source
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 3. Feed Filter Toggle

```tsx
// components/feed/FeedViewToggle.tsx
export function FeedViewToggle() {
  const [view, setView] = useState('personalized'); // 'all' | 'personalized' | 'custom-only'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {viewLabels[view]} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setView('personalized')}>
          <Check className={view === 'personalized' ? 'visible' : 'invisible'} />
          My Personalized Feed
          <span className="text-xs text-muted-foreground">
            (Enabled sources only)
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setView('all')}>
          <Check className={view === 'all' ? 'visible' : 'invisible'} />
          All Sources
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setView('custom-only')}>
          <Check className={view === 'custom-only' ? 'visible' : 'invisible'} />
          My Custom Sources Only
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## ⚙️ Background Jobs

### Fetch User Feeds

```typescript
// app/api/cron/fetch-user-feeds/route.ts
export async function POST(request: Request) {
  // Verify cron auth
  
  // Get all active user sources
  const userSources = await prisma.userSource.findMany({
    where: {
      isEnabled: true,
      isValid: true,
    },
    include: {
      user: true,
    },
  });

  for (const userSource of userSources) {
    try {
      // Parse RSS feed
      const feed = await parseRSSFeed(userSource.feedUrl);
      
      // Store articles
      for (const item of feed.items) {
        await prisma.userArticle.upsert({
          where: {
            // Composite unique key: userId + article URL
            userId_url: {
              userId: userSource.userId,
              url: item.link,
            },
          },
          create: {
            userId: userSource.userId,
            userSourceId: userSource.id,
            title: item.title,
            url: item.link,
            excerpt: item.contentSnippet,
            imageUrl: item.enclosure?.url,
            author: item.creator,
            publishedAt: new Date(item.pubDate),
          },
          update: {
            // Update if article changed
            title: item.title,
            excerpt: item.contentSnippet,
          },
        });
      }

      // Update source metadata
      await prisma.userSource.update({
        where: { id: userSource.id },
        data: {
          lastFetchedAt: new Date(),
          articleCount: feed.items.length,
          feedTitle: feed.title,
          feedDescription: feed.description,
          siteUrl: feed.link,
          logoUrl: feed.image?.url,
          fetchAttempts: 0,
          lastFetchError: null,
        },
      });
    } catch (error) {
      // Handle fetch errors
      await prisma.userSource.update({
        where: { id: userSource.id },
        data: {
          lastFetchError: error.message,
          fetchAttempts: { increment: 1 },
          // Mark as invalid after 5 failed attempts
          isValid: userSource.fetchAttempts < 4,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}
```

---

## 🎯 Free vs Premium Tiers

### Free Tier
- ✅ Access to all 13 default sources
- ✅ Can hide/show default sources
- ✅ **10 custom RSS sources maximum**
- ✅ Bookmarks (unlimited)
- ✅ Basic preferences

### Premium Tier (Future)
- ✅ Everything in Free
- ✅ **Unlimited custom sources**
- ✅ Custom themes
- ✅ Advanced filters
- ✅ Export/import sources (OPML)
- ✅ Priority feed refresh
- ✅ Reading statistics
- ✅ Ad-free badge (even though already ad-free 😄)

**Price**: $3-5/month or $30-50/year

---

## 📊 Success Metrics

### Engagement
- % of users who add custom sources
- Average number of custom sources per user
- % of users who disable default sources
- Daily active users with personalized feeds

### Conversion
- Free to Premium conversion rate
- Time to first custom source added
- Retention: users with custom sources vs without

### Technical
- Feed fetch success rate
- Average fetch time per source
- Invalid feed detection rate

---

## 🚀 Implementation Plan

### Phase 1: Core Functionality (Week 1-2)
**Estimated: 7-10 days**

- [ ] Database schema & migrations
- [ ] API endpoints for CRUD operations
- [ ] RSS feed validation & parsing
- [ ] Basic UI: My Sources page
- [ ] Add/Remove custom sources
- [ ] Feed fetching cron job

### Phase 2: Source Preferences (Week 2-3)
**Estimated: 3-5 days**

- [ ] Default source toggle UI
- [ ] User preferences API
- [ ] Unified feed query (respecting preferences)
- [ ] Feed view toggle (All/Personalized/Custom)

### Phase 3: Polish & UX (Week 3-4)
**Estimated: 3-5 days**

- [ ] Better error handling & validation
- [ ] Source logos/favicons
- [ ] Feed preview before adding
- [ ] Bulk actions (enable/disable multiple)
- [ ] Search/filter sources
- [ ] OPML import/export

### Phase 4: Premium Foundation (Week 4-5)
**Estimated: 2-3 days**

- [ ] Tier limits enforcement
- [ ] Premium upgrade flow (UI only)
- [ ] Usage tracking & analytics
- [ ] Tier comparison page

---

## 🎨 User Onboarding

### First-time User Flow

```
1. User creates account
   ↓
2. Welcome modal:
   "Welcome to FeedCentral! 🎉
    You now have access to:
    ✓ 13 curated tech sources
    ✓ Add up to 10 custom RSS feeds
    ✓ Personalize your feed"
   
   [Add Your First Custom Source] [Explore Default Sources]
   ↓
3. Quick tutorial overlay on feed:
   "👆 Toggle sources here"
   "➕ Add custom sources here"
   "🔖 Bookmark articles to save them"
```

### Empty State (No Custom Sources Yet)

```tsx
<EmptyState
  icon={<Rss />}
  title="No custom sources yet"
  description="Add your favorite blogs, podcasts, and news sources to personalize your feed"
  action={{
    label: "Add Your First Source",
    onClick: openAddDialog
  }}
  secondaryAction={{
    label: "Browse Popular Feeds",
    onClick: showFeedDirectory // Future: curated directory
  }}
/>
```

---

## 🔒 Security & Validation

### Feed Validation Rules

```typescript
async function validateRSSFeed(feedUrl: string) {
  // 1. URL validation
  if (!isValidURL(feedUrl)) {
    throw new Error('Invalid URL format');
  }

  // 2. Protocol check (HTTP/HTTPS only)
  if (!feedUrl.startsWith('http')) {
    throw new Error('Feed must use HTTP or HTTPS');
  }

  // 3. Fetch with timeout (10 seconds)
  const response = await fetch(feedUrl, {
    timeout: 10000,
    headers: { 'User-Agent': 'FeedCentral/1.0' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status}`);
  }

  // 4. Content type check
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('xml') && !contentType?.includes('rss')) {
    // Still try to parse, some feeds have wrong content-type
  }

  // 5. Parse feed
  const text = await response.text();
  const feed = await parseRSS(text);

  if (!feed.items || feed.items.length === 0) {
    throw new Error('Feed contains no articles');
  }

  // 6. Check for required fields
  if (!feed.title) {
    throw new Error('Feed has no title');
  }

  return {
    isValid: true,
    feedTitle: feed.title,
    feedDescription: feed.description,
    siteUrl: feed.link,
    articleCount: feed.items.length,
    logoUrl: feed.image?.url,
  };
}
```

### Rate Limiting

```typescript
// Limit feed additions
- 5 feed additions per hour per user
- 20 feed additions per day per user
- Prevent spam/abuse
```

### Sanitization

```typescript
// Sanitize feed content
- Strip malicious scripts from RSS content
- Validate image URLs
- Sanitize HTML in excerpts
```

---

## 📝 Translation Keys

### English (`messages/en.json`)

```json
{
  "sources": {
    "mySources": {
      "title": "My Sources",
      "subtitle": "Manage your custom RSS feeds and source preferences",
      "customSources": "Your Custom Sources",
      "defaultSources": "Default Sources",
      "usage": "{current} of {limit} sources used",
      "addSource": "Add Source",
      "noCustomSources": {
        "title": "No custom sources yet",
        "description": "Add your favorite blogs, podcasts, and news sources",
        "action": "Add Your First Source"
      },
      "addDialog": {
        "title": "Add Custom RSS Source",
        "description": "Add any RSS or Atom feed to your collection",
        "feedUrl": "RSS Feed URL",
        "feedUrlPlaceholder": "https://example.com/feed.xml",
        "customName": "Custom Name (Optional)",
        "customNamePlaceholder": "Leave empty to use feed's name",
        "validate": "Validate",
        "validating": "Checking...",
        "add": "Add Source",
        "cancel": "Cancel",
        "validation": {
          "valid": "Valid Feed",
          "invalid": "Invalid Feed",
          "foundArticles": "Found {count} articles"
        },
        "limitReached": "You've reached the free tier limit. Upgrade to Premium for unlimited sources."
      },
      "sourceCard": {
        "articles": "{count} articles",
        "updated": "Updated {time}",
        "enabled": "Enabled in feed",
        "disabled": "Disabled in feed",
        "edit": "Edit",
        "delete": "Delete",
        "refresh": "Refresh",
        "toggleOn": "Show in feed",
        "toggleOff": "Hide from feed"
      }
    }
  }
}
```

### French (`messages/fr.json`)

```json
{
  "sources": {
    "mySources": {
      "title": "Mes Sources",
      "subtitle": "Gérez vos flux RSS personnalisés et vos préférences",
      "customSources": "Vos Sources Personnalisées",
      "defaultSources": "Sources Par Défaut",
      "usage": "{current} sur {limit} sources utilisées",
      "addSource": "Ajouter une Source",
      "noCustomSources": {
        "title": "Aucune source personnalisée",
        "description": "Ajoutez vos blogs, podcasts et sources d'actualités préférés",
        "action": "Ajouter Votre Première Source"
      }
      // ... rest of translations
    }
  }
}
```

---

## 🎯 Priority & Timeline

**Priority**: ⭐ **HIGHEST** (Before Reader Mode)  
**Total Effort**: 15-20 days  
**Target Release**: December 2025  

### Why This First?

1. ✅ **Stronger account value proposition** than reader mode
2. ✅ **Unique differentiator** - not all aggregators allow custom sources
3. ✅ **Foundation for premium tiers** - clear upgrade path
4. ✅ **User retention** - personalized content = engaged users
5. ✅ **Easier to implement** than full reader mode with scraping

---

## 🔄 Future Enhancements

### Phase 2 Features (Post-Launch)
- OPML import/export
- Feed discovery/directory
- Shared source collections
- Source recommendations based on interests
- Folder/tag organization

### Premium Features
- Unlimited sources
- Custom categories
- Feed filtering rules (keywords, authors)
- Email digests
- Mobile app access
- Priority support

---

---

## ✅ Approval & Implementation

**Status**: ✅ **Approved & Ready for Development**  
**Priority**: Highest - Top of Roadmap  
**Target Release**: Mid-December 2025  
**Estimated Effort**: 15-20 days  
**Owner**: BENZOOgataga

### Implementation Phases

**Phase 1**: Core functionality (Dec 1-10)  
**Phase 2**: Source preferences (Dec 11-15)  
**Phase 3**: Polish & UX (Dec 16-20)  
**Phase 4**: Premium foundation (Dec 21-24)

### Next Steps
1. ✅ Specification complete
2. ⏳ Create database migrations
3. ⏳ Implement API endpoints
4. ⏳ Build UI components
5. ⏳ Deploy & test

---

**This confirmed feature will transform FeedCentral from a curated aggregator into a truly personalized news platform!** 🚀

---

**Document Version**: 1.0  
**Last Updated**: November 7, 2025  
**Next Review**: December 1, 2025 (before implementation)
