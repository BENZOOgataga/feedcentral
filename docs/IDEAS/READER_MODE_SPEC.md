# Reader Mode Preview - Planned Feature

> **Status**: 📋 Confirmed for Q1 2026  
> **Priority**: High (After Custom RSS Sources)  
> **Type**: Core Feature Enhancement

## 📖 Overview

**Reader Mode** is a confirmed planned feature that will allow users to read full article content directly within FeedCentral, providing a clean, distraction-free reading experience without leaving the platform. This feature will be implemented after the Custom RSS Sources feature is completed.

---

## 🎯 Goals

### User Goals
- Read articles without ads, popups, or tracking
- Stay within FeedCentral ecosystem
- Consistent reading experience across all sources
- Save time by avoiding external site navigation

### Business Goals
- Increase user engagement and time on site
- Differentiate from basic RSS readers
- Provide value that encourages account creation
- Reduce bounce rate to external sites

---

## 🏗️ Architecture

### Data Flow

```
RSS Feed Content → Parse & Extract → Store in DB → Render in UI
     ↓                   ↓                ↓            ↓
1. Full content      2. Clean HTML    3. Cache    4. Display
   in <content>         extraction      article     reader
   tag (if exists)      fallback        content     mode
```

### Two Approaches

#### **Approach A: RSS Content-Based (Preferred)**
```typescript
// Most RSS feeds include full or partial content
<content:encoded> or <description>
  - Already in RSS feed
  - No additional fetching needed
  - Faster implementation
  - Respects publisher's syndication
```

**Pros:**
- ✅ Fast and efficient
- ✅ No scraping needed
- ✅ Respects RSS standards
- ✅ Content already sanitized

**Cons:**
- ❌ Some feeds only include excerpts
- ❌ Formatting may vary
- ❌ Images might be missing

#### **Approach B: Web Scraping (Fallback)**
```typescript
// For feeds with limited content, scrape the full article
- Use library like @mozilla/readability
- Extract main content from URL
- Clean and parse HTML
- Cache result
```

**Pros:**
- ✅ Always gets full content
- ✅ Works with any article

**Cons:**
- ❌ More complex
- ❌ Slower (requires fetching)
- ❌ May break if site structure changes
- ❌ Potential legal/ethical concerns
- ❌ Rate limiting issues

---

## 🗄️ Database Schema Changes

### Add `fullContent` field to Article model

```prisma
model Article {
  id              String    @id @default(cuid())
  title           String
  url             String
  excerpt         String?   @db.Text
  
  // NEW: Full article content for reader mode
  fullContent     String?   @db.Text  // HTML content
  contentType     String?   @default("excerpt") // "full" | "excerpt" | "unavailable"
  
  imageUrl        String?
  author          String?
  publishedAt     DateTime
  sourceId        String
  source          Source    @relation(fields: [sourceId], references: [id])
  categoryId      String
  category        Category  @relation(fields: [categoryId], references: [id])
  
  bookmarks       Bookmark[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime?
  
  @@index([sourceId])
  @@index([categoryId])
  @@index([publishedAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
  @@index([deletedAt])
}
```

---

## 🎨 UI/UX Design

### Reader Mode Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [← Back to Feed]              [🔖 Bookmark]  [⚙️ Settings]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Article Title Goes Here                                     │
│  ─────────────────────────────                               │
│  By Author Name • TechCrunch • 5 min read • Nov 7, 2025     │
│                                                               │
│  [Visit Original Article →]                                  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│    Featured Image (if available)                             │
│                                                               │
│    Article content paragraph 1. Lorem ipsum dolor sit        │
│    amet, consectetur adipiscing elit. Clean, readable        │
│    text with proper spacing and typography.                  │
│                                                               │
│    ## Subheading                                             │
│                                                               │
│    More content here with proper formatting:                 │
│    • Bullet points                                           │
│    • Lists                                                   │
│    • Code blocks                                             │
│                                                               │
│    > Blockquotes styled nicely                               │
│                                                               │
│    Images embedded inline...                                 │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  Published on TechCrunch                                     │
│  [Read Original] [Share] [Print]                             │
└─────────────────────────────────────────────────────────────┘
```

### Reader Settings Panel

```
┌──────────────────────────┐
│  Reader Settings         │
├──────────────────────────┤
│  Font Size               │
│  [A-] [A] [A+]          │
│                          │
│  Width                   │
│  [Narrow] [Med] [Wide]  │
│                          │
│  Theme                   │
│  [☀️ Light] [🌙 Dark]   │
│                          │
│  Font Family             │
│  [Serif] [Sans]         │
└──────────────────────────┘
```

---

## 🔧 Implementation Steps

### Phase 1: Backend (RSS Content Extraction)
**Estimated: 1-2 days**

1. **Update RSS Parser**
   - Extract `<content:encoded>` or `<description>`
   - Sanitize HTML content
   - Store in `fullContent` field
   - Set `contentType` appropriately

2. **Update API Endpoints**
   - `/api/articles/[id]` - Include fullContent
   - Add `?include=content` parameter
   - Lazy load content on demand

3. **Database Migration**
   - Add new fields to Article model
   - Backfill existing articles (if possible)

### Phase 2: Frontend (Reader UI)
**Estimated: 2-3 days**

1. **Create Reader Components**
   ```
   components/reader/
   ├── ReaderView.tsx           # Main reader container
   ├── ReaderHeader.tsx         # Title, meta, actions
   ├── ReaderContent.tsx        # Article content renderer
   ├── ReaderSettings.tsx       # Font size, width controls
   └── ReaderToolbar.tsx        # Bookmark, share, etc.
   ```

2. **Create Reader Route**
   ```
   app/[locale]/article/[id]/page.tsx
   ```

3. **Update Article Cards**
   - Add "Read in FeedCentral" button
   - Keep "Visit Original" as secondary action

### Phase 3: Enhancement Features
**Estimated: 2-3 days**

1. **Reading Preferences**
   - Save user preferences (font size, width)
   - Persist in localStorage or user settings
   - Sync across devices (if authenticated)

2. **Content Parsing Improvements**
   - Handle code blocks with syntax highlighting
   - Embed videos (YouTube, Vimeo)
   - Lazy load images
   - Table formatting

3. **Analytics**
   - Track read time
   - Count full article reads
   - Popular articles metric

### Phase 4: Advanced Features (Optional)
**Estimated: 3-5 days**

1. **Web Scraping Fallback**
   - Use @mozilla/readability
   - Implement rate limiting
   - Cache scraped content
   - Handle errors gracefully

2. **Text-to-Speech**
   - Browser Web Speech API
   - Play/pause controls
   - Reading progress indicator

3. **Annotations & Highlights**
   - Select text to highlight
   - Add personal notes
   - Save highlights to database

---

## 📦 Required Dependencies

```bash
# Content parsing & sanitization
npm install dompurify
npm install turndown  # HTML to Markdown (optional)

# Optional: Web scraping fallback
npm install @mozilla/readability
npm install jsdom

# Optional: Syntax highlighting for code blocks
npm install prismjs
# or
npm install highlight.js
```

---

## 🔒 Content Sanitization

**Critical**: Must sanitize HTML to prevent XSS attacks

```typescript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'a', 'img',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    ALLOW_DATA_ATTR: false,
  });
}
```

---

## ⚖️ Legal & Ethical Considerations

### RSS Content (✅ Generally OK)
- Publishers syndicate content via RSS intentionally
- Respect `<content:encoded>` when provided
- Always link back to original source
- Display publisher attribution

### Web Scraping (⚠️ Use Carefully)
- Check site's `robots.txt`
- Respect rate limits
- Consider Terms of Service
- Use only as fallback
- Cache to reduce requests

### Best Practices
- ✅ Always show "Read Original" link prominently
- ✅ Display source logo and attribution
- ✅ Don't strip ads if in RSS content
- ✅ Respect `noindex` or content restrictions
- ✅ Provide opt-out for publishers

---

## 📊 Success Metrics

### Engagement
- % of users who use reader mode
- Average read time in reader mode
- Reader mode vs external navigation ratio

### Retention
- Users who return after using reader mode
- Bookmark rate in reader mode
- Account creation from reader users

### Performance
- Time to render reader view
- Content availability rate
- Error rate (failed content loads)

---

## 🚀 Rollout Strategy

### Phase 1: Beta (2-3 weeks)
- Enable for authenticated users only
- Limited to articles with full RSS content
- Collect feedback

### Phase 2: Public (1 month)
- Enable for all users
- Add scraping fallback for popular sources
- Monitor usage metrics

### Phase 3: Polish (Ongoing)
- Add advanced features based on usage
- Optimize performance
- Handle edge cases

---

## 🎯 Priority Assessment

**Estimated Total Effort**: 7-10 days  
**User Impact**: High  
**Technical Complexity**: Medium-High  
**Business Value**: High

### Why This Is Valuable

1. **Competitive Advantage**
   - Most basic RSS readers lack this
   - Matches premium readers (Feedly, Inoreader)

2. **User Retention**
   - Keep users in ecosystem
   - Increase session duration
   - Better analytics on reading habits

3. **Monetization Opportunity**
   - Premium feature for free tier limits
   - "Read X articles in reader mode per month"

4. **Data Collection**
   - Understand what users read fully
   - Improve recommendations
   - Better content curation

---

## 🔄 Alternatives Considered

### Option 1: External Reader Integration
- Integrate with Pocket, Instapaper
- **Pros**: No development needed
- **Cons**: Loses users to external service

### Option 2: Modal Preview Only
- Show excerpt in modal, link for full article
- **Pros**: Simpler implementation
- **Cons**: Doesn't solve core problem

### Option 3: Full Implementation (Recommended)
- Complete reader mode within FeedCentral
- **Pros**: Best UX, keeps users engaged
- **Cons**: More development time

---

## 📝 Implementation Questions

These questions will be resolved during the implementation phase:

1. Should reader mode be available to non-authenticated users?
2. How to handle paywalled content?
3. Should we cache scraped content permanently?
4. Do we need offline reading support (PWA)?
5. Should we provide publisher opt-out mechanism?

---

## ✅ Approval & Timeline

**Status**: ✅ **Approved & Planned**  
**Priority**: High (Q1 2026)  
**Target Release**: February 2026  
**Dependencies**: None (can be developed in parallel with other features)  
**Owner**: BENZOOgataga

**This feature is confirmed for implementation and will be developed after Custom RSS Sources is completed.**

---

**Document Version**: 1.0  
**Last Updated**: November 7, 2025  
**Next Review**: January 2026
