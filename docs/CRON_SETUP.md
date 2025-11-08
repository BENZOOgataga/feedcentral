# FeedCentral Cron Jobs Setup

## Overview
FeedCentral uses cron jobs to automatically fetch RSS feeds from both global sources and user-specific sources.

## Available Endpoints

### 1. Global RSS Feeds
- **URL**: `https://feedcentral.lyradevstudio.com/api/cron/fetch-feeds`
- **Purpose**: Fetches articles from admin-managed sources (13 sources)
- **Schedule**: Every 30 minutes recommended
- **Query Params**:
  - `concurrency=5` - Parallel fetch limit (default: 5, max: 10)
  - `sourceId=xxx` - Fetch single source only (optional)

### 2. User-Specific Sources
- **URL**: `https://feedcentral.lyradevstudio.com/api/cron/fetch-user-sources`
- **Purpose**: Fetches articles from user-added custom RSS feeds
- **Schedule**: Every 30 minutes recommended
- **Query Params**:
  - `concurrency=5` - Parallel fetch limit (default: 5, max: 10)
  - `userId=xxx` - Fetch sources for specific user (optional)

### 3. Statistics
- **URL**: `https://feedcentral.lyradevstudio.com/api/cron/stats`
- **Purpose**: Monitor RSS fetching performance
- **Query Params**:
  - `limit=10` - Recent jobs to show (default: 10, max: 100)
  - `sourceId=xxx` - Filter by source (optional)

## Authentication

All endpoints require the `CRON_API_KEY` header:

```bash
Authorization: Bearer YOUR_CRON_API_KEY
```

**Generate a secure key:**
```bash
openssl rand -base64 32
```

**Add to Vercel:**
```bash
echo "YOUR_GENERATED_KEY" | vercel env add CRON_API_KEY production
```

---

## Setup on Your VM

### 1. Make the script executable
```bash
chmod +x scripts/cron-runner.sh
```

### 2. Set environment variable
Add to `~/.bashrc` or `~/.profile`:
```bash
echo 'export CRON_API_KEY="your-secret-key-here"' >> ~/.bashrc
source ~/.bashrc
```

### 3. Add to crontab
```bash
crontab -e
```

Add this line to run every 30 minutes:
```cron
*/30 * * * * /full/path/to/feedcentral/scripts/cron-runner.sh >> /var/log/feedcentral-cron.log 2>&1
```

### 4. View logs
```bash
tail -f /var/log/feedcentral-cron.log
```

---

## Manual Testing

### Fetch Global RSS Feeds
```bash
curl -X POST https://feedcentral.lyradevstudio.com/api/cron/fetch-feeds \
  -H "Authorization: Bearer YOUR_CRON_API_KEY" \
  -H "Content-Type: application/json"
```

### Fetch User Sources
```bash
curl -X POST https://feedcentral.lyradevstudio.com/api/cron/fetch-user-sources \
  -H "Authorization: Bearer YOUR_CRON_API_KEY" \
  -H "Content-Type: application/json"
```

### Get Statistics
```bash
curl -X GET "https://feedcentral.lyradevstudio.com/api/cron/stats?limit=20" \
  -H "Authorization: Bearer YOUR_CRON_API_KEY" | jq '.'
```

---

## Cron Schedule Reference

| Schedule | Description |
|----------|-------------|
| `*/30 * * * *` | Every 30 minutes (recommended) |
| `*/15 * * * *` | Every 15 minutes |
| `0 * * * *` | Every hour |
| `0 */2 * * *` | Every 2 hours |
| `0 0 * * *` | Daily at midnight |

---

## Performance Tuning

### Adjust Concurrency
```bash
# Fetch with higher concurrency (8 feeds in parallel)
curl "https://feedcentral.lyradevstudio.com/api/cron/fetch-feeds?concurrency=8" \
  -H "Authorization: Bearer YOUR_CRON_API_KEY"
```

### Fetch Specific User Only
```bash
curl "https://feedcentral.lyradevstudio.com/api/cron/fetch-user-sources?userId=USER_ID" \
  -H "Authorization: Bearer YOUR_CRON_API_KEY"
```

---

## Monitoring

### Check Recent Performance
```bash
curl "https://feedcentral.lyradevstudio.com/api/cron/stats?limit=50" \
  -H "Authorization: Bearer YOUR_CRON_API_KEY" | jq '.'
```

### Expected Response
```json
{
  "success": true,
  "summary": {
    "recentJobs": {
      "total": 50,
      "completed": 48,
      "failed": 2,
      "successRate": "96.00%"
    },
    "articles": {
      "found": 450,
      "added": 120,
      "duplicates": 330
    },
    "performance": {
      "avgDurationSeconds": "45.00s"
    }
  }
}
```

---

## Troubleshooting

### Check if cron is running
```bash
grep CRON /var/log/syslog
```

### Test script manually
```bash
./scripts/cron-runner.sh
```

### Verify environment variable
```bash
echo $CRON_API_KEY
```

### Check crontab entries
```bash
crontab -l
```

### View recent executions
```bash
tail -100 /var/log/feedcentral-cron.log
```

---

## Security Notes

1. **Never commit CRON_API_KEY to git**
2. Store the key in environment variables only
3. Use a strong random key (32+ characters)
4. Rotate the key periodically
5. Restrict script permissions:
   ```bash
   chmod 700 scripts/cron-runner.sh
   ```
   - `API_URL` to your Vercel domain
   - `CRON_API_KEY` to match your env variable

---

## Option 3: GitHub Actions (Free & Simple)

Create `.github/workflows/cron-jobs.yml`:

```yaml
name: Cron Jobs

on:
  schedule:
    # Fetch feeds every 30 minutes
    - cron: '*/30 * * * *'
    # Cleanup articles daily at 2 AM
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  fetch-feeds:
    runs-on: ubuntu-latest
    if: github.event.schedule == '*/30 * * * *' || github.event_name == 'workflow_dispatch'
    steps:
      - name: Fetch Feeds
        run: |
          curl -X POST https://your-domain.vercel.app/api/cron/fetch-feeds \
            -H "Authorization: Bearer ${{ secrets.CRON_API_KEY }}" \
            -H "Content-Type: application/json"
  
  cleanup-articles:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 2 * * *' || github.event_name == 'workflow_dispatch'
    steps:
      - name: Cleanup Articles
        run: |
          curl -X POST https://your-domain.vercel.app/api/cron/cleanup-articles \
            -H "Authorization: Bearer ${{ secrets.CRON_API_KEY }}" \
            -H "Content-Type: application/json"
```

Add `CRON_API_KEY` to GitHub Secrets:
1. Go to repo Settings → Secrets → Actions
2. Add secret: `CRON_API_KEY` with your key

---

## Testing

Test endpoints manually:

```bash
# Test fetch feeds
curl -X POST https://your-domain.vercel.app/api/cron/fetch-feeds \
  -H "Authorization: Bearer YOUR_CRON_API_KEY"

# Test cleanup
curl -X POST https://your-domain.vercel.app/api/cron/cleanup-articles \
  -H "Authorization: Bearer YOUR_CRON_API_KEY"
```

---

## Recommended: Option 3 (GitHub Actions)

**Pros:**
- ✅ Free for public repos
- ✅ Built into your repo
- ✅ Easy to manage
- ✅ Logs available in GitHub

**Cons:**
- ⚠️ Requires public repo or GitHub Pro for private repos
- ⚠️ May have slight delays (up to 5 minutes)

---

## Quick Setup Commands

```bash
# Set environment variable in Vercel
vercel env add CRON_API_KEY production

# Or use Vercel dashboard:
# Project Settings → Environment Variables → Add
# Name: CRON_API_KEY
# Value: your-secret-key-here
```
