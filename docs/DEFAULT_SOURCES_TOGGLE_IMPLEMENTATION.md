# Default Sources Toggle Implementation

## Overview
This document details the implementation of the Default Sources toggle functionality, which allows users to enable/disable default RSS sources that appear in their feed without deleting them from the system.

## Implementation Date
Completed: December 2024

## Features Implemented

### 1. API Endpoint - User Source Preferences
**File**: `/app/api/user/source-preferences/route.ts`

**Endpoints**:
- `GET /api/user/source-preferences` - Fetch user's source preferences
- `PATCH /api/user/source-preferences` - Update a single source preference

**Functionality**:
- Upserts UserSourcePreference records (unique constraint on userId + sourceId)
- Handles enable/disable state for each default source
- Returns preference data with source details
- Validates source exists before creating preference

**Request Format** (PATCH):
```json
{
  "sourceId": "source-id-here",
  "isEnabled": true
}
```

**Response Format** (PATCH):
```json
{
  "message": "Preference updated successfully",
  "preference": {
    "id": "preference-id",
    "userId": "user-id",
    "sourceId": "source-id",
    "isEnabled": true
  }
}
```

### 2. Switch UI Component
**File**: `/components/ui/switch.tsx`

**Technology**: Radix UI Switch primitive
**Styling**: Tailwind CSS with custom utilities
**Features**:
- Accessible toggle control
- Disabled state support
- Focus visible ring
- Smooth transition animations
- Primary color when checked, muted when unchecked

### 3. My Sources Page Updates
**File**: `/app/[locale]/app/sources/page.tsx`

**New State Variables**:
- `togglingIds: Set<string>` - Tracks sources being toggled (loading state)
- `preferences: Record<string, boolean>` - Maps sourceId to isEnabled state

**Updated Functions**:

#### `fetchSources()`
- Now fetches user preferences in parallel with sources
- Builds preferences map for quick lookup
- Defaults to enabled (true) if no preference exists

#### `handleToggleDefaultSource(source, newState)`
- Optimistically updates UI immediately
- Sends PATCH request to update preference
- Reverts on error with toast notification
- Manages loading state via togglingIds Set
- Shows error toast on failure

**UI Changes**:
- Default Sources tab now shows stats bar with:
  - Total sources count
  - Enabled sources count
- Each source card displays:
  - Source logo and name
  - Category
  - Enabled/Disabled status text
  - Switch toggle control
  - Loading state (disabled switch during toggle)
- Switch is disabled during toggle operation
- Status text updates immediately (optimistic UI)

### 4. Translations
**Files**: 
- `/messages/en.json`
- `/messages/fr.json`

**New Translation Keys**:
```json
{
  "sources.mySources.defaultSources.counts": {
    "total": "Total: {count}",
    "enabled": "Enabled: {count}"
  },
  "sources.mySources.sourceCard.statuses": {
    "enabled": "Enabled",
    "disabled": "Disabled"
  }
}
```

French equivalents:
- "Total : {count}" / "Activées : {count}"
- "Activé" / "Désactivé"

## Technical Details

### Database Model Used
Model: `UserSourcePreference` (from Prisma schema)
```prisma
model UserSourcePreference {
  id        String   @id @default(cuid())
  userId    String
  sourceId  String
  isEnabled Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  source Source @relation(fields: [sourceId], references: [id], onDelete: Cascade)

  @@unique([userId, sourceId])
  @@index([userId])
  @@map("user_source_preferences")
}
```

### Default Behavior
- **No preference exists**: Source is enabled by default
- **Preference exists**: Uses `isEnabled` value from database
- **On toggle**: Upserts preference record
- **Optimistic UI**: Updates immediately, reverts on error

### Error Handling
- Network errors: Reverts optimistic update, shows error toast
- Invalid source: API returns 404, shows error toast
- Duplicate toggles: Prevented by disabled state during operation

### Performance Optimizations
- Parallel fetching of sources and preferences
- Optimistic UI updates for instant feedback
- Single loading state per source (not global)
- Efficient Set-based toggling state management

## Testing Checklist

- [x] Build compiles successfully
- [x] TypeScript types correct
- [x] API endpoint registered
- [ ] Manual testing - Toggle default source on
- [ ] Manual testing - Toggle default source off
- [ ] Manual testing - Refresh page, verify preference persists
- [ ] Manual testing - Multiple rapid toggles (race condition)
- [ ] Manual testing - Network error handling
- [ ] Manual testing - Disabled state during toggle
- [ ] Manual testing - Stats count updates correctly
- [ ] Manual testing - French translation displays correctly

## Integration Points

### Feed Fetching
The feed fetching logic (in main feed page) should:
1. Fetch user's custom sources
2. Fetch user's source preferences
3. Filter default sources based on preferences
4. Combine enabled custom sources + enabled default sources
5. Display merged feed

**Note**: This integration is pending and should be implemented in the main feed component.

### Future Enhancements
- Bulk toggle all/none buttons
- Category-based bulk toggles
- Search/filter for sources
- Sort by name/category/status
- Export/import preferences

## Dependencies Added
- `@radix-ui/react-switch` - Toggle switch component

## Build Status
✅ Build successful (0 errors)
✅ All routes registered
✅ TypeScript compilation clean

## Routes Added
- `/api/user/source-preferences` (GET, PATCH)

## Files Created
1. `/app/api/user/source-preferences/route.ts` (120 lines)
2. `/components/ui/switch.tsx` (35 lines)

## Files Modified
1. `/app/[locale]/app/sources/page.tsx` - Added toggle functionality
2. `/messages/en.json` - Added translations
3. `/messages/fr.json` - Added French translations

## Total Lines Added
- API: ~120 lines
- Component: ~35 lines
- Page updates: ~80 lines (net)
- Translations: ~10 keys

**Total: ~250 lines of new code**
